export default function (data: any) {
    return {
        textStyle: {
            fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
        },
        // title: {
        //     text: '赌卡统计',
        //     left: 'center',
        // },
        graphic: {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
                // text: '总数',
                text:
                    '总计' +
                    '\n\n' +
                    data.reduce((n: number, i: any) => {
                        return (n += i.value);
                    }, 0) + ' 次',

                textAlign: 'center',
                fill: '#333',
                width: 100,
                height: 100,
                fontSize: 12
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
            top: '5%',
            orient: 'vertical',
            left: 'left',
            icon: 'circle',
            formatter: function (name: string) {
                let target;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].name === name) {
                        target = data[i].value
                    }
                }
                let arr = [`${name} ${target} 次`]
                return arr.join("\n")
            }
        },
        series: [
            {
                name: '统计数据',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                minAngle: 15,
                // label: {
                //     show: false,
                //     position: 'center'
                // },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                label: {
                    normal: {
                        show: true,
                        position: 'inner', // 数值显示在内部
                        formatter: '{d}%', // 格式化数值百分比输出
                    },
                },
                data
            }
        ]
    }
};