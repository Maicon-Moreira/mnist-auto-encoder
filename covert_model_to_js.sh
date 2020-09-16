tensorflowjs_converter --input_format keras \
                       ./decoder.h5 \
                       ./website/decoder

tensorflowjs_converter --input_format keras \
                       ./encoder.h5 \
                       ./website/encoder