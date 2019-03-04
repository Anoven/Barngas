#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2019 vasav <vasav.shah@harvestmeasurement.ca>
#
# Distributed under terms of the MIT license.

"""
This class is supposed to be used to simplify all the object data to one place
"""
from datetime import datetime

class Data:
    def __init__ (self, sensor_id, group_id, base_id, time, value):
        self.sensor_id = sensor_id
        self.group_id = group_id
        self.base_id = base_id
        self.time = time
        self.value = value
        self.year = time.year
        self.month = time.month
        self.day = time.day
        self.hour = time.hour
        self.time_str = time.isoformat()
    
