function fileDownLoad(url){
    var fileTransfer = new FileTransfer();

    fileTransfer.download(
        url,
        cordova.file.dataDirectory,
        function(entry) {
            alert("download complete: " + entry.toURL());
        },
        function(error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
        },
        false,
        {
            headers: {
                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            }
        }
    );
}

/**
 * 缓存语音文件
 * @param src
 */
function loadFile(src) {
    ImgCache.isCached(src, function(path, success) {
        if (success) {
            return setFile(src);
        } else {
            ImgCache.cacheFile(src, function() {
                return setFile(src);
            },function() {
                if(src)
                {
                    return src;
                }
            });
        }

    });
}

function setFile(src) {
    ImgCache.getCachedFileURL(src, function(src, dest) {
        return dest;
    });
}