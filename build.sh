#!/bin/bash

set -e

# Allow git to operate in the mounted volume (different owner inside container)
git config --global --add safe.directory /src
git config --global --add safe.directory /src/rnnoise

export OPTIMIZE="-O3 -flto"
export LDFLAGS=${OPTIMIZE}
export CFLAGS=${OPTIMIZE}
export CXXFLAGS=${OPTIMIZE}

OUTPUT_FILE="rnnoise-sync.js"
OUTPUT_DIR="../src/generated"

echo "============================================="
echo "Compiling wasm bindings"
echo "============================================="

cd rnnoise

# Clean possible autotools clutter that might affect the configurations step
git clean -f -d
./autogen.sh

emconfigure ./configure CFLAGS="${OPTIMIZE}" --enable-static=no --disable-examples --disable-doc --host=x86_64-unknown-linux-gnu
emmake make clean
emmake make V=1

# Compile librnnoise to wasm with sync loading and inline bytecode
emcc \
    ${OPTIMIZE} \
    --no-entry \
    -s STRICT=1 \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s STACK_SIZE=1048576 \
    -s MALLOC=emmalloc \
    -s MODULARIZE=1 \
    -s ENVIRONMENT="web,worker" \
    -s EXPORT_ES6=1 \
    -s USE_ES6_IMPORT_META=0 \
    -s WASM_ASYNC_COMPILATION=0 \
    -s SINGLE_FILE=1 \
    -s FILESYSTEM=0 \
    -s ASSERTIONS=0 \
    -s MINIMAL_RUNTIME=0 \
    -s INCOMING_MODULE_JS_API=[] \
    --closure 1 \
    -s EXPORT_NAME="createRNNWasmModuleSync" \
    -s EXPORTED_FUNCTIONS="['_rnnoise_process_frame','_rnnoise_init','_rnnoise_destroy','_rnnoise_create','_malloc','_free']" \
    -s EXPORTED_RUNTIME_METHODS="['HEAPF32']" \
    .libs/librnnoise.so \
    -o "${OUTPUT_FILE}"

# Create output folder
rm -rf "${OUTPUT_DIR}"
mkdir -p "${OUTPUT_DIR}"

mv "${OUTPUT_FILE}" "${OUTPUT_DIR}/"

# Clean clutter
git clean -f -d

echo "============================================="
echo "Compiling wasm bindings done"
echo "============================================="
