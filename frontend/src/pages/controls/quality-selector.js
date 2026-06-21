export function bindQualitySelector(select, onQualityChange) {
    const handleChange = () => {
        onQualityChange(Number(select.value));
    };

    select.addEventListener('change', handleChange);

    return {
        setLevels(levels) {
            select.replaceChildren(createOption('Auto', -1));

            levels.forEach((level) => {
                select.appendChild(createOption(level.label, level.index));
            });

            select.hidden = levels.length <= 1;
        },
        destroy() {
            select.removeEventListener('change', handleChange);
        }
    };
}

function createOption(label, value) {
    const option = document.createElement('option');
    option.value = String(value);
    option.textContent = label;
    return option;
}
