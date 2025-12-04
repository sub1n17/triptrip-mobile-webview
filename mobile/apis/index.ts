export const useApis = (webviewRef) => {
    // 응답
    const onResponse = (result) => {
        webviewRef.current?.postMessage(JSON.stringify(result));
    };

    // 요청
    const onRequest = (request) => {
        switch (request.query) {
            case 'CreatePlace': {
                const formData = request.payload;
                onResponse({
                    CreatePlace: formData,
                });
                break;
            }
        }
    };
    return { onResponse, onRequest };
};
