function detect_crossroad_type () {
    while (true) {
        IR_new = get_IR_Data()
        // 終點(8)
        if (IR_new[0] > 1200 && IR_new[4] > 1200 && IR_new[2] > 1200) {
            goal_timer += 1
            if (goal_timer > 50) {
                crossroad_type = 8
                break;
            }
        } else {
            goal_timer = 0
        }
        // T字(3)或十字(7)
        if (IR_new[0] < 500 && IR_old[0] > 1200 && IR_new[4] < 500 && IR_old[4] > 1200) {
            if (IR_old[2] > 1200 && IR_new[2] < 500) {
                crossroad_type = 3
                break;
            } else {
                crossroad_type = 7
                break;
            }
        }
        // 左轉(1)或左卜(5)
        if (IR_new[0] < 500 && IR_old[0] > 1200 && IR_old[4] < 500) {
            if (IR_new[2] > 1200) {
                crossroad_type = 5
                break;
            } else {
                crossroad_type = 1
                break;
            }
        }
        // 右轉(2)或右卜(6)
        if (IR_new[4] < 500 && IR_old[4] > 1200 && IR_new[0] < 500) {
            if (IR_new[2] > 1200) {
                crossroad_type = 6
                break;
            } else {
                crossroad_type = 2
                break;
            }
        }
        // 死路(4)
        if (IR_new[2] < 500 && (IR_new[1] < 500 && IR_new[3] < 500) && (IR_old[0] < 500 && IR_old[4] < 500)) {
            crossroad_type = 4
            break;
        }
        IR_old = IR_new
    }
}
function reset_trace_err () {
    trace_err = 0
    trace_err_old = 0
}
function trace_line (base_speed: number, Kp: number, Kd: number) {
    line_position = BitRacer.readLine()
    trace_err = 0 - line_position
    delta_err = trace_err - trace_err_old
    trace_err_old = trace_err
    PD_Value = Kp * trace_err + Kd * delta_err
    BitRacer.motorRun(BitRacer.Motors.M_L, base_speed - PD_Value)
    BitRacer.motorRun(BitRacer.Motors.M_R, base_speed + PD_Value)
}
input.onButtonPressed(Button.A, function () {
    // 搜尋迷宮
    basic.showIcon(IconNames.Rabbit)
    basic.pause(1000)
    drive_car(0)
    while (true) {
        if (crossroad_type == 1 || crossroad_type == 5 || crossroad_type == 3 || crossroad_type == 7) {
            drive_car(1)
        }
        if (crossroad_type == 2) {
            drive_car(2)
        }
        if (crossroad_type == 4) {
            drive_car(3)
        }
        if (crossroad_type == 8) {
            drive_car(4)
            break;
        }
    }
})
function drive_car (mode: number) {
    reset_trace_err()
    // mode == 0 直走
    if (mode == 0) {
        basic.showString("S")
        move_ticks = 0
        while (true) {
            trace_line(320, 250, 140)
            IR_new = get_IR_Data()
            move_ticks += 1
            if (move_ticks > total_move_ticks && (IR_new[0] > 1200 || IR_new[4] > 1200 || IR_new[1] < 500 && IR_new[2] < 500 && IR_new[3] < 500)) {
                basic.showString("X")
                BitRacer.motorRun(BitRacer.Motors.All, 50)
                break;
            }
        }
        detect_crossroad_type()
    }
    // mode == 1 左轉
    if (mode == 1) {
        basic.showString("L")
        BitRacer.LED(BitRacer.LEDs.LED_L, BitRacer.LEDswitch.on)
        while (true) {
            BitRacer.motorRun(BitRacer.Motors.M_R, 0 + turn_pwm)
            BitRacer.motorRun(BitRacer.Motors.M_L, 0 - turn_pwm)
            turn_ticks += 1
            if (turn_ticks >= total_turn_ticks && BitRacer.readIR2(0) > 1200) {
                basic.showString("C")
                turn_ticks = 0
                while (true) {
                    trace_line(0, 220, 250)
                    if (line_position <= 0.3 && line_position >= -0.3) {
                        BitRacer.motorRun(BitRacer.Motors.All, 0)
                        break;
                    }
                }
                break;
            }
        }
        BitRacer.LED(BitRacer.LEDs.LED_L, BitRacer.LEDswitch.off)
        basic.showIcon(IconNames.Happy)
    }
    // mode == 2 右轉
    if (mode == 2) {
        basic.showString("R")
        BitRacer.LED(BitRacer.LEDs.LED_R, BitRacer.LEDswitch.on)
        while (true) {
            BitRacer.motorRun(BitRacer.Motors.M_R, 0 - turn_pwm)
            BitRacer.motorRun(BitRacer.Motors.M_L, 0 + turn_pwm)
            turn_ticks += 1
            if (turn_ticks >= total_turn_ticks && BitRacer.readIR2(4) > 1200) {
                basic.showString("C")
                turn_ticks = 0
                while (true) {
                    trace_line(0, 220, 250)
                    if (line_position <= 0.3 && line_position >= -0.3) {
                        BitRacer.motorRun(BitRacer.Motors.All, 0)
                        break;
                    }
                }
                break;
            }
        }
        BitRacer.LED(BitRacer.LEDs.LED_R, BitRacer.LEDswitch.off)
        basic.showIcon(IconNames.Happy)
    }
    // mode == 2 迴轉
    if (mode == 3) {
        basic.showString("U")
        BitRacer.LED(BitRacer.LEDs.LED_R, BitRacer.LEDswitch.on)
        BitRacer.LED(BitRacer.LEDs.LED_L, BitRacer.LEDswitch.on)
        while (true) {
            BitRacer.motorRun(BitRacer.Motors.M_R, 0 - turn_pwm)
            BitRacer.motorRun(BitRacer.Motors.M_L, 0 + turn_pwm)
            turn_ticks += 1
            if (turn_ticks >= total_turn_ticks * 2 && BitRacer.readIR2(4) > 1200) {
                basic.showString("C")
                turn_ticks = 0
                while (true) {
                    trace_line(0, 220, 250)
                    if (line_position <= 0.3 && line_position >= -0.3) {
                        BitRacer.motorRun(BitRacer.Motors.All, 0)
                        break;
                    }
                }
                break;
            }
        }
        BitRacer.LED(BitRacer.LEDs.LED_L, BitRacer.LEDswitch.off)
        BitRacer.LED(BitRacer.LEDs.LED_R, BitRacer.LEDswitch.off)
        basic.showIcon(IconNames.Happy)
    }
    // mode == 4 停止
    if (mode == 4) {
        BitRacer.motorRun(BitRacer.Motors.All, 0)
    }
}
input.onButtonPressed(Button.AB, function () {
    // 校正IR感應器
    basic.showString("*")
    basic.pause(1000)
    music.playTone(262, music.beat(BeatFraction.Whole))
    BitRacer.CalibrateBegin()
    // 雙輪PWM=250移動600ms
    BitRacer.motorRun(BitRacer.Motors.All, 250)
    basic.pause(600)
    BitRacer.motorRun(BitRacer.Motors.All, 0)
    BitRacer.CalibrateEnd(BitRacer.LineColor.White)
    basic.showIcon(IconNames.Heart)
    music.playTone(262, music.beat(BeatFraction.Half))
    music.playTone(200, music.beat(BeatFraction.Half))
})
function get_IR_Data () {
    let IR: number[] = []
    for (let ir_no = 0; ir_no <= 4; ir_no++) {
        IR[ir_no] = BitRacer.readIR2(ir_no)
    }
    return IR
}
let turn_ticks = 0
let move_ticks = 0
let PD_Value = 0
let delta_err = 0
let line_position = 0
let trace_err_old = 0
let trace_err = 0
let IR_old: number[] = []
let crossroad_type = 0
let goal_timer = 0
let IR_new: number[] = []
let turn_pwm = 0
let total_turn_ticks = 0
let total_move_ticks = 0
let base_speed = 0
let Kp = 0
let Kd = 0
total_move_ticks = 40
total_turn_ticks = 100
turn_pwm = 390
