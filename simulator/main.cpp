#include <stdio.h>
#include <emscripten.h>
#include <emscripten/bind.h>

#include "vrEmu6502.h"

uint8_t ram[0x10000]; // 64 KiB
VrEmu6502* cpu;

uint8_t ram_read(uint16_t address, bool is_debug) {
    if ((address & 0xFF00) == 0xFE00) {
        return 0;
    }

    return ram[address];
}

void ram_write(uint16_t address, uint8_t value) {
    if ((address & 0xFF00) == 0xFE00) {
        printf("%c", value);

        return;
    }

    ram[address] = value;
}

void setup() {
    const char* hello = "Hello, world!\n";
    uint16_t address = 0x2000;

    for (uint16_t i = 0; hello[i]; i++) {
        ram[address++] = 0xA9; // LDA #
        ram[address++] = hello[i];
        ram[address++] = 0x8D; // STA abs
        ram[address++] = 0x00;
        ram[address++] = 0xFE;
    }

    ram[address++] = 0x4C; // JMP abs
    ram[address++] = 0x00;
    ram[address++] = 0x20;

    ram[0xFFFC] = 0x00;
    ram[0xFFFD] = 0x20;

    cpu = vrEmu6502New(CPU_W65C02, ram_read, ram_write);
}

void loop() {
    for (unsigned int i = 0; i < 256; i++) {
        vrEmu6502Tick(cpu);
    }
}

EMSCRIPTEN_BINDINGS(aletheia) {
    emscripten::function("setup", &setup);
    emscripten::function("loop", &loop);
}