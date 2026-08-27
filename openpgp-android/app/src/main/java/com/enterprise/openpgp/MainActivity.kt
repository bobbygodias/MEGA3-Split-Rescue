package com.enterprise.openpgp

import android.annotation.SuppressLint
import android.app.Activity
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.WebViewAssetLoader

class MainActivity : Activity() {
    private lateinit var webView: WebView
    private val allowedHost = WebViewAssetLoader.DEFAULT_DOMAIN

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView = WebView(this)
        webView.setBackgroundColor(Color.rgb(13, 17, 23))
        setContentView(webView)

        val s = webView.settings
        s.javaScriptEnabled = true
        s.domStorageEnabled = false
        s.allowFileAccess = false
        s.allowContentAccess = false
        @Suppress("DEPRECATION")
        run {
            s.allowFileAccessFromFileURLs = false
            s.allowUniversalAccessFromFileURLs = false
        }
        s.cacheMode = WebSettings.LOAD_NO_CACHE
        s.mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        s.setSupportMultipleWindows(false)
        s.javaScriptCanOpenWindowsAutomatically = false
        if (android.os.Build.VERSION.SDK_INT >= 26) s.safeBrowsingEnabled = true

        WebView.setWebContentsDebuggingEnabled(false)

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                return !isAllowed(request?.url)
            }

            override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
                val url = request?.url ?: return blocked()
                if (!isAllowed(url)) return blocked()
                val response = assetLoader.shouldInterceptRequest(url) ?: return blocked()
                response.responseHeaders = mapOf(
                    "Content-Security-Policy" to "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; img-src 'none'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'",
                    "Cache-Control" to "no-store",
                    "X-Content-Type-Options" to "nosniff",
                    "Referrer-Policy" to "no-referrer"
                )
                return response
            }
        }

        webView.loadUrl("https://$allowedHost/assets/index.html")
    }

    private fun isAllowed(url: Uri?): Boolean =
        url != null && url.scheme == "https" && url.host == allowedHost && url.path?.startsWith("/assets/") == true

    private fun blocked(): WebResourceResponse = WebResourceResponse(
        "text/plain", "UTF-8", 403, "Blocked", mapOf("Cache-Control" to "no-store"), "Blocked".byteInputStream()
    )

    override fun onDestroy() {
        webView.clearHistory()
        webView.clearCache(true)
        webView.removeAllViews()
        webView.destroy()
        super.onDestroy()
    }
}
