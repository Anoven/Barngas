#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2019 vasav <vasa.shah@harvestmeasurement>
#
# Distributed under terms of the MIT license.

"""
This file is to hold all the command parsers.
All comands should be in JSON format.
"""
import json

class GeneralCmd:
    base_id= 0;
    def __init__(self, base_id):
        self.base_id = base_id


class BaseCmd(GeneralCmd):
    command = ""
    def __init__(self, json_msg):
        try:
            tmp_json = json.loads(json_msg)
            GeneralCmd.__init__(self,tmp_json["base_id"])
            self.command = tmp_json["cmd"]
        except:
            raise Exception("Invalid Json!")

class SensorCmd(GeneralCmd):
    sensor_id = None
    command = ""
    def __init__(self, json_msg):
        try:
            tmp_json = json.loads(json_msg)
            GeneralCmd.__init__(self,tmp_json["base_id"])
            self.sensor_id = tmp_json["sensor_id"]
            self.command = tmp_json["cmd"]
        except:
            raise Exception("Invalid Json!")

