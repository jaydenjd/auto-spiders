# -*- coding: utf-8 -*-
# @Time   : 2021/4/22 上午10:19
# @Author : wu

"""
安装 mitmproxy 证书
手机设置代理
执行命令 mitmdump -s xhs_mitm.py -p 8081

小红书用户信息和参数搜集 mitm 自动拦截并写到 csv 上
"""
import csv
import json
import os
from urllib.parse import parse_qsl

from mitmproxy import ctx


def response(flow):
    url = flow.request.url
    info = ctx.log.info
    file = "xhs.csv"
    # 不存在则创建
    if not os.path.exists(file):
        with open(file, "w", newline="") as csvfile:
            fieldnames = [
                "手机号",
                "设备",
                "sid",
                "account",
                "deviceId",
                "device_fingerprint",
                "device_fingerprint1",
                "密码",
                "昵称",
                "兴趣",
                "性别",
                "年龄",
            ]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            # 第一次的时候写入头即可，后面运行的时候注释掉
            writer.writeheader()

    # if 'https://edith.xiaohongshu.com/api/sns/v3/user/me' in url:
    if "api/sns/v3/user/me" in url:
        r_headers = flow.request.headers
        info(str(flow.request.headers))
        headers = {k: v for k, v in r_headers.items()}
        valid_params = dict(parse_qsl(headers["xy-common-params"]))
        res = json.loads(flow.response.text)

        # 以下信息需要自行填写
        phone = ""
        device = "PX-01"
        hobby = ""
        gender = ""
        age = ""

        data = {
            "手机号": phone,
            "设备": device,
            "sid": valid_params["sid"],
            "account": res["data"]["userid"],
            "deviceId": valid_params["deviceId"],
            "device_fingerprint": valid_params["device_fingerprint"],
            "device_fingerprint1": valid_params["device_fingerprint1"],
            "密码": "",
            "昵称": res["data"]["nickname"],
            "兴趣": hobby,
            "性别": gender,
            "年龄": age,
        }
        info(str(data))
        with open(file, "r", newline="") as csvfile:
            _reader = csv.DictReader(csvfile)
            sids = [_row["sid"] for _row in _reader]
        # 每次都根据某个参数来判断是否写入过
        if data["sid"] not in sids:
            with open(file, "a+", newline="") as csvfile:
                fieldnames = list(data.keys())
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writerow(data)