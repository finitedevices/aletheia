#!/bin/bash

if [ "$1" == "--install-dev" ]; then
    devdeps/emsdk/emsdk install latest
    devdeps/emsdk/emsdk activate latest
fi

source devdeps/emsdk/emsdk_env.sh

emcmake cmake .
make