
# sudo docker build -t m -f bender/Dockerfile .

FROM debian
# using an older Ubuntu i.e. WSL you would need to use an updated protobuf repository
# RUN sudo add-apt-repository ppa:maarten-fonville/protobuf

RUN apt update
RUN apt install -y build-essential protobuf-compiler python-protobuf libprotobuf-dev
WORKDIR /src/nanopb
COPY . .
RUN make -C generator/proto
RUN make -C examples/simple
RUN make -C bender/c
RUN make -C bender/cpp
CMD ["examples/simple/simple"]
