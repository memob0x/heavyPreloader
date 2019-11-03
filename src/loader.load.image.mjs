export const loadImage = url =>
    new Promise((resolve, reject) => {
        const proxy = document.createElement("img");

        proxy.onload = () => resolve(url);
        proxy.onerror = (message, source, lineno, colno, error) =>
            reject(error);

        proxy.src = url;
    });
