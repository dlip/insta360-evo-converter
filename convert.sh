#!/usr/bin/env bash

ffmpeg -i VID_20210613_124629_00_133.insv -i VID_20210613_124629_10_133.insv -filter_complex hstack -c:v libx264 -crf 26 ffmpeg3.mp4
