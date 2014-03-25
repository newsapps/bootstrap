#!/bin/bash

jekyll build
s3cmd sync --acl-public _gh_pages/ s3://docs.tribapps.com
