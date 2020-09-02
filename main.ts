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
    for (let ir_no = 0; ir_no <= 4; ir_no++) {
        IR_new[ir_no] = BitRacer.readIR2(ir_no)
    }
}
let PD_Value = 0
let delta_err = 0
let line_position = 0
let trace_err_old = 0
let trace_err = 0
let IR_new: number[] = []
let IR_old: number[] = []
let Kp = 0
let Kd = 0
let base_speed = 0
let base_turn_speeed = 0