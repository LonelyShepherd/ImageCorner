export function hideOrDisplay(element) {
    if (element.getAttribute('aria-hidden') === 'true') {
        element.style.display = 'block';
        element.setAttribute('aria-hidden', false);
        return;
    }

    element.style.display = 'none';
    element.setAttribute('aria-hidden', true);
}

export function hasClass(target, className) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
}

export function isChildOf(child, parent) {

    while ((child = child.parentNode) && child !== parent);
    return !!child;
} 

export function prepend(element, reference) {
    reference.insertBefore(element, reference.firstChild);
}

export function parents(node) {
    let first = node.parentNode,
        parentNodes = [];

    let selector = arguments[1];

    if (selector) {
        while (first) {
            if (hasClass(first, selector))
                return first;

            first = first.parentNode;
        }

        return null;
    }

    while (first) {
        parentNodes.push(first);

        first = first.parentNode;
    }

    return parentNodes;
}

export function addImages(imagesList, data) {
    data.forEach(image => {
        let li = document.createElement('li');

        li.id = image.Id;
        li.className = 'image-item';
        li.setAttribute('data-title', image.Name);

        li.innerHTML =
            `<div class="image-container" title="${image.Name}">
                        <img src="/Uploads/${image.OwnerId}/${image.Name}">
                        ${image.Mode == 'Public' ? '<span>showcasing</span>' : ''}
                    </div>
                    <div>
                        <span>${image.Name}</span>
                        <div class="js-dropdown js-image-dropdown">
                            <button class="js-dropdown-drop"><i></i><i></i><i></i></button>
                            <div class="menu" aria-hidden="true">
                                <ul class="section">
                                    <li><button>Share</button></li>
                                    <li><button>Make ${image.Mode == 'Public' ? 'Private' : 'Public'}</button></li>
                                    <li><button>Remove</button></li>
                                </ul>
                            </div>
                        </div>
                        <span>${image.Posted}</span>
                    </div>`;

        prepend(li, imagesList);
    });
}