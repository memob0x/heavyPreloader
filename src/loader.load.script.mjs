export const loadScript = url =>
    new Promise((resolve, reject) => {
        const proxy = document.createElement("script");

        proxy.onload = () => resolve(url);
        proxy.onerror = (message, source, lineno, colno, error) =>
            reject(error);

        proxy.src = url;

        document.querySelector("head").appendChild(proxy);
    });
