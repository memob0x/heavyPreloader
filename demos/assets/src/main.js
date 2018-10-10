const logEl = document.querySelector('#console');
export const log = string => {
    if (!logEl.hasChildNodes()) {
        const ol = document.createElement('ol');
        logEl.append(ol);
    }

    const list = logEl.querySelector('ol');
    const li = document.createElement('li');
    li.innerHTML = string;
    list.append(li);

    logEl.scrollTop = list.offsetHeight;
};
