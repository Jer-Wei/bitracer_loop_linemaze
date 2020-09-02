function detect_crossroad_type () {
    let goal_timer: number = 0
    while (true) {
        IR_new = get_IR_Data()
        // The Goal (8)
        if (IR_new[0] > 1200 && IR_new[4] > 1200 && IR_new[2] > 1200) {
            goal_timer += 1
            if (goalTimer > 50) {
                return 8
                break
            }
        } else {
            goal_timer = 0
        }
        // The T crossroad (3) or the + crossroad (7)
        if (IR_new[0] < 500 && IR_old [0] > 1200 && IR_new[4] < 500 && IR_old [4] > 1200) {
        	if (IR_old[2] > 1200 && IR_new[2] <500){
                return 3
                break
            } else {
                return 7
                break
            }
        }
        // The left turn (1) or the straight-left crossroad (5) 
        if (IR_new[0] < 500 && IR_old[0] > 1200 && IR_old[4] < 500){
            if (IR_new[2] > 1200) {
                return 5
                break
            } else {
                return 1
                break
            }
        }
        // The right turn (2) or the straight-right crossroad (6)
        if (IR_new[4] < 500 && IR_old[4] > 1200 && IR_new[0] < 500) {
            if (IR_new[2] > 1200){
                return 6
                break
            } else {
                return 2
                break
            }
        }
        // the dead end (4)
        if (IR_new[2] < 500 && (IR_new[1] < 500 && IR_new[3] < 500) && (IR_old[0] < 500 && IR_old[4] < 500)) {
            return 4
            break
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
function get_IR_Data () {
    let IR: number[] = []
    for (let ir_no = 0; ir_no <= 4; ir_no++) {
        IR[ir_no] = BitRacer.readIR2(ir_no)
    }
    return IR
}
let PD_Value = 0
let delta_err = 0
let line_position = 0
let trace_err_old = 0
let trace_err = 0
let goalTimer = 0
let base_turn_speeed = 0
let base_speed = 0
let Kd = 0
let Kp = 0
let crossroad_type: number = 0
let IR_new: number[] = []
let IR_old: number[] = []