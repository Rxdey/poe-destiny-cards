import json
import urllib.parse
import requests
from pyquery import PyQuery as pq
import threading
import concurrent.futures
import re
import os

data_list = None
# 全部卡片列表
json_file_path = "./list.json"
# 卡片详情地址
url = 'https://poedb.tw/cn/hover?t=item&n='

try:
    with open(json_file_path, "r", encoding="utf-8") as json_file:
        data_list = json.load(json_file)
        for item in data_list:
            item["url"] = url + urllib.parse.quote(item["type"])
except Exception as e:
    print(f"发生错误：{e}")

# 存储结果
result = []

# 使用正则表达式提取 background-image 的 URL
def getImageUrl(str):
    match = re.search(r"url\('([^']+)'\)", str)
    if match:
        return match.group(1)
    else:
        return ''

# 下载图片
def download_img(data):
    try:
        response = requests.get(data['iconUrl'])
        if response.status_code == 200:
            # 从URL中提取文件名
            filename = os.path.join('./img', data["id"] + '.png')
            with open(filename, 'wb') as img_file:
                img_file.write(response.content)
        else:
            print(f"下载失败：{data['url']}")
    except requests.exceptions.RequestException as e:
        print(f"下载图片时发生错误")

def crawl_url(data):
    try:
        response = requests.get(url=data["url"], timeout=(30, 50))
        if response.status_code == 200:
            doc = pq(response.text)
            title = doc('.FlavourText').text()
            data['flavourText'] = title
            data['stack'] = doc('.stackSize').text()
            # 提取图片地址
            icon_div = doc('.icon')
            style_attribute = icon_div.attr('style')
            imgUrl = getImageUrl(style_attribute)
            data['iconUrl'] = imgUrl
            data['icon'] = data['id'] + '.png'
            result.append(data)
            # 下载图片
            # download_img(data)
        else:
            print(f"请求失败，状态码：{data['name']}")

    except requests.exceptions.RequestException as e:
        print(f"请求异常：{data['name']}")


with concurrent.futures.ThreadPoolExecutor(max_workers=100) as executor:
    futures = [executor.submit(crawl_url, item) for item in data_list]

    # 初始化已完成和未完成任务计数器
    completed_count = 0
    total_count = len(futures)

    # 实时打印进度
    for future in concurrent.futures.as_completed(futures):
        completed_count += 1
        print(f"已完成 {completed_count}/{total_count} 任务")


with open('./result.json', 'w', encoding='utf-8') as json_file:
    json.dump(result, json_file, ensure_ascii=False, indent=4)
print("操作完成，结果已保存到result.json文件中。")
