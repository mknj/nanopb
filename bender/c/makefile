# Include the nanopb provided Makefile rules
include ../../extra/nanopb.mk

# Compiler flags to enable all warnings & debug info
CFLAGS = -Wall -Werror -g -O0 -DPB_ENABLE_MALLOC=1
CFLAGS += -I$(NANOPB_DIR)

# C source code files that are required
CSRC  = app.c                   # The main program
CSRC += bender.pb.c                # The compiled protocol definition
CSRC += $(NANOPB_DIR)/pb_encode.c  # The nanopb encoder
CSRC += $(NANOPB_DIR)/pb_decode.c  # The nanopb decoder
CSRC += $(NANOPB_DIR)/pb_common.c  # The nanopb common parts

# Build rule for the main program
app: $(CSRC)
	$(CC) $(CFLAGS) -oapp $(CSRC)

# Build rule for the protocol
bender.pb.c: ../bender.proto
	cd ..;$(PROTOC) $(PROTOC_OPTS) --nanopb_out=c bender.proto

clean: 
	rm -f bender.pb.* bender.js bender.d.ts app events.pb.stream
