function trace_line (base_speed: number, Kp: number, Kd: number) {
    line_position = BitRacer.readLine()
    trace_err = 0 - line_position
    delta_err = trace_err - trace_err_old
    trace_err_old = trace_err
    PD_Value = Kp * trace_err + Kd * delta_err
    BitRacer.motorRun(BitRacer.Motors.M_R, base_speed + PD_Value)
    BitRacer.motorRun(BitRacer.Motors.M_L, base_speed - PD_Value)
}
function calibrate_IR () {
    basic.showIcon(IconNames.Ghost)
    basic.pause(1000)
    BitRacer.CalibrateBegin()
    BitRacer.motorRun(BitRacer.Motors.All, 250)
    basic.pause(500)
    BitRacer.motorRun(BitRacer.Motors.All, 0)
    BitRacer.CalibrateEnd(BitRacer.LineColor.White)
    basic.showIcon(IconNames.Yes)
}
input.onButtonPressed(Button.AB, function () {
    calibrate_IR()
})
input.onButtonPressed(Button.B, function () {
    while (true) {
        IR_new = get_IR_Data()
        serial.writeNumbers(IR_new)
        line_position = BitRacer.readLine()
        serial.writeValue("line", line_position)
        basic.pause(500)
    }
})
function get_IR_Data () {
    IR = []
    for (let IR_no = 0; IR_no <= 4; IR_no++) {
        IR[IR_no] = BitRacer.readIR2(IR_no)
    }
    return IR
}
let IR: number[] = []
let PD_Value = 0
let trace_err_old = 0
let delta_err = 0
let trace_err = 0
let line_position = 0
let IR_new: number[] = []
let goal_timer = 0
let tuen_ticks = 0
let move_ticks = 0
let crossroad_type = 0
let IR_old: number[] = []
IR_new = []
let total_move_ticks = 40
let total_turn_ticks = 100
serial.redirectToUSB()
