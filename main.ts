function detect_crossroad_type () {
    let goal_timer: number = 0
    while (true) {
        IR_new = get_IR_Data()
        /* 終點 (8) */
        if (IR_new[0] > 1200 && IR_new[4] > 1200 && IR_new[2] > 1200) {
            goal_timer += 1
            if (goal_timer > 50) {
                crossroad_type = 8
                break
            }
        } else {
            goal_timer = 0
        }
        // The T crossroad (3) or the + crossroad (7)
        if (IR_new[0] < 500 && IR_old [0] > 1200 && IR_new[4] < 500 && IR_old [4] > 1200) {
        	if (IR_old[2] > 1200 && IR_new[2] <500){
                crossroad_type = 3
                break
            } else {
                crossroad_type = 7
                break
            }
        }
        // The left turn (1) or the straight-left crossroad (5) 
        if (IR_new[0] < 500 && IR_old[0] > 1200 && IR_old[4] < 500){
            if (IR_new[2] > 1200) {
                crossroad_type = 5
                break
            } else {
                crossroad_type = 1
                break
            }
        }
        // The right turn (2) or the straight-right crossroad (6)
        if (IR_new[4] < 500 && IR_old[4] > 1200 && IR_new[0] < 500) {
            if (IR_new[2] > 1200){
                crossroad_type = 6
                break
            } else {
                crossroad_type = 2
                break
            }
        }
        // the dead end (4)
        if (IR_new[2] < 500 && (IR_new[1] < 500 && IR_new[3] < 500) && (IR_old[0] < 500 && IR_old[4] < 500)) {
            crossroad_type = 4
            break
        }
        IR_old = IR_new
    }
}
function drive_car(mode: number) {
    let move_ticks: number = 0          //直線區域移動次數
    let total_move_ticks: number = 40   //直線區域預計可移動總次數
    let turn_pwm: number = 390          //轉彎的PWM值
    let turn_ticks:number = 0           //轉彎區域移動次數
    let total_turn_ticks:number = 100   //轉彎區域預計可移動總次數
    reset_trace_err()
    // mode == 0 straight
    if (mode == 0) {
        basic.showString("S")
        move_ticks = 0
        while (true) {
            trace_line(320, 250, 140)
            IR_new = get_IR_Data()
            move_ticks += 1
            if (move_ticks > total_move_ticks && (IR_new[0] > 1200 || IR_new[4] > 1200 || (IR_new[1] < 500 && IR_new[2] < 500 && IR_new[3] < 500))) {
                basic.showString("X")
                BitRacer.motorRun(BitRacer.Motors.All, 50)
                break
            }
        }
        detect_crossroad_type()
    }
    // mode == 1 turn left
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
                    if (line_position <= 0.3 && line_position >= -0.3){
                        BitRacer.motorRun(BitRacer.Motors.All, 0)
                        break
                    }
                }
                break
                
            }
        }
        BitRacer.LED(BitRacer.LEDs.LED_L, BitRacer.LEDswitch.off)
        basic.showIcon(IconNames.Happy)
    }
    // mode == 2 turn right
    if (mode == 2) {
        basic.showString("R")
        BitRacer.LED(BitRacer.LEDs.LED_R, BitRacer.LEDswitch.on)
        while(true) {
            BitRacer.motorRun(BitRacer.Motors.M_R, 0 - turn_pwm)
            BitRacer.motorRun(BitRacer.Motors.M_L, 0 + turn_pwm)
            turn_ticks += 1            
            if (turn_ticks >= total_turn_ticks && BitRacer.readIR2(4) > 1200) {
                basic.showString("C")
                turn_ticks = 0
                while (true) {
                    trace_line(0, 220, 250)
                    if (line_position <= 0.3 && line_position >= -0.3){
                        BitRacer.motorRun(BitRacer.Motors.All, 0)
                        break
                    }
                }
                break
            }
        }
        BitRacer.LED(BitRacer.LEDs.LED_R, BitRacer.LEDswitch.off)
        basic.showIcon(IconNames.Happy)
    }
    // mode == 2 U turn
    if (mode == 3) {
        basic.showString("U")
        BitRacer.LED(BitRacer.LEDs.LED_R, BitRacer.LEDswitch.on)
        BitRacer.LED(BitRacer.LEDs.LED_L, BitRacer.LEDswitch.on)
        while(true) {
            BitRacer.motorRun(BitRacer.Motors.M_R, 0 - turn_pwm)
            BitRacer.motorRun(BitRacer.Motors.M_L, 0 + turn_pwm)
            turn_ticks += 1            
            if (turn_ticks >= total_turn_ticks * 2 && BitRacer.readIR2(4) > 1200) {
                basic.showString("C")
                turn_ticks = 0
                while (true) {
                    trace_line(0, 220, 250)
                    if (line_position <= 0.3 && line_position >= -0.3){
                        BitRacer.motorRun(BitRacer.Motors.All, 0)
                        break
                    }
                }
                break
            }
        }
        BitRacer.LED(BitRacer.LEDs.LED_L, BitRacer.LEDswitch.off)
        BitRacer.LED(BitRacer.LEDs.LED_R, BitRacer.LEDswitch.off)
        basic.showIcon(IconNames.Happy)        
    }
    // mode == 4 stop
    if (mode == 4) {
        BitRacer.motorRun(BitRacer.Motors.All, 0)
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
function get_IR_Data () {
    let IR: number[] = []
    for (let ir_no = 0; ir_no <= 4; ir_no++) {
        IR[ir_no] = BitRacer.readIR2(ir_no)
    }
    return IR
}
let PD_Value = 0
let delta_err = 0
let line_position: number = 0
let trace_err_old = 0
let trace_err = 0
let base_turn_speeed = 0
let base_speed = 0
let Kd = 0
let Kp = 0
let crossroad_type: number = 0
let IR_new: number[] = []
let IR_old: number[] = []