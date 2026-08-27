import * as openpgp from './openpgp.min.mjs';
const $ = id => document.getElementById(id);
const status = (msg, ok=true) => { $('result').textContent = msg; $('result').className = 'status ' + (ok?'good':'bad'); };

function runtimeDiag(){
  const checks = {
    secureContext: self.isSecureContext,
    subtleCrypto: !!(self.crypto && self.crypto.subtle),
    getRandomValues: !!(self.crypto && self.crypto.getRandomValues),
    streams: !!self.ReadableStream && !!self.TransformStream,
    bigint: typeof BigInt === 'function'
  };
  const ok = Object.values(checks).every(Boolean);
  $('diag').textContent = Object.entries(checks).map(([k,v]) => `${v?'✓':'✗'} ${k}`).join('\n') + `\n\n${ok?'Runtime compatível.':'Runtime incompatível.'}\n${navigator.userAgent}`;
  $('diag').className = 'status ' + (ok?'good':'bad');
}
runtimeDiag();

$('gen').onclick = async () => {
  try {
    status('Gerando chaves…');
    const userIDs = [{ name: $('name').value.trim() || 'OpenPGP User', email: $('email').value.trim() || undefined }];
    const opts = { type:'ecc', curve:'curve25519', userIDs, format:'armored' };
    if ($('pass').value) opts.passphrase = $('pass').value;
    const { privateKey, publicKey } = await openpgp.generateKey(opts);
    $('priv').value = privateKey; $('pub').value = publicKey;
    status('Par de chaves gerado.');
  } catch(e){ status(String(e?.message || e), false); }
};

$('enc').onclick = async () => {
  try {
    const key = await openpgp.readKey({armoredKey:$('pub').value});
    const message = await openpgp.createMessage({text:$('plain').value});
    $('cipher').value = await openpgp.encrypt({message, encryptionKeys:key});
    status('Texto criptografado.');
  } catch(e){ status(String(e?.message || e), false); }
};

async function unlockedPrivateKey(){
  let key = await openpgp.readPrivateKey({armoredKey:$('priv').value});
  if (!key.isDecrypted()) {
    if (!$('pass').value) throw new Error('Informe a frase-senha da chave privada.');
    key = await openpgp.decryptKey({privateKey:key, passphrase:$('pass').value});
  }
  return key;
}

$('dec').onclick = async () => {
  try {
    const key = await unlockedPrivateKey();
    const message = await openpgp.readMessage({armoredMessage:$('cipher').value});
    const {data} = await openpgp.decrypt({message, decryptionKeys:key});
    $('plain').value = data;
    status('Mensagem descriptografada.');
  } catch(e){ status(String(e?.message || e), false); }
};

$('sign').onclick = async () => {
  try {
    const key = await unlockedPrivateKey();
    const message = await openpgp.createCleartextMessage({text:$('signText').value});
    $('signed').value = await openpgp.sign({message, signingKeys:key});
    status('Assinatura criada.');
  } catch(e){ status(String(e?.message || e), false); }
};

$('verify').onclick = async () => {
  try {
    const key = await openpgp.readKey({armoredKey:$('pub').value});
    const message = await openpgp.readCleartextMessage({cleartextMessage:$('signed').value});
    const verification = await openpgp.verify({message, verificationKeys:key});
    await verification.signatures[0].verified;
    status('Assinatura válida.');
  } catch(e){ status('Assinatura inválida: ' + String(e?.message || e), false); }
};
