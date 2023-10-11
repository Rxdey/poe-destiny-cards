/** 
 * 前往下面页面控制台爬取
 * https://poedb.tw/cn/Divination_Cards#命运卡物品
 */
const copyToClipboard = txt => {
    const node = document.createElement('textarea');
    node.value = txt;
    node.class = 'copy-txt';
    document.body.appendChild(node);
    node.select();
    document.execCommand('Copy');
    document.body.removeChild(node);
};
const generateId = (type) => type.replace(/\s/g, '-').replace(/'/g, '').toLocaleLowerCase();
const txt = JSON.stringify(
    Array.from($('table').eq(7).find('tbody tr')).map(item => {
        const td = $(item).find('td').eq(1);
        const type = decodeURIComponent(
            $(td)
                .find('a')
                .attr('data-hover')
                .match(/n=(.*)?/)[1]
                .replace(/\+/g, ' ')
        );
        return {
            name: $(td).find('a').text(),
            stack: $(td).find('.text-type0').text(),
            id: generateId(type),
            type,
            explicitMod: Array.from($(td).find('.explicitMod span')).length ? Array.from($(td).find('.explicitMod span')).map(ch => ({ type: $(ch).attr('class'), value: $(ch).text() })) : [{ type: 'magicitem', value: $(td).find('.explicitMod').text() }],
        };
    })
);
copyToClipboard(txt);
