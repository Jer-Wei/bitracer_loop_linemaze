// 偵測路口型態，傳會變數crossroad_type路口型態值
// 0 = 直線, 1 = 左彎, 2 = 右彎, 3 = T字,
// 4 = 死路, 5 = 左卜, 6 = 右卜, 7 = 十字,
// 8 = 終點
function detect_crossroad_type () {
    while (true) {
        IR_new = get_IR_Data()
        if (IR_new[0] > 1200 && IR_new[2] > 1200 && IR_new[4] > 1200) {
            goal_timer += 1
            if (goal_timer > 55) {
                goal_timer = 0
                crossroad_type = 8
                break;
            }
        } else {
            goal_timer = 0
        }
        if (IR_new[0] < 700 && IR_old[0] > 1200 && IR_new[4] < 700 && IR_old[4] > 1200) {
            if (IR_old[2] > 1200 && IR_new[2] < 700) {
                crossroad_type = 3
                break;
            } else {
                crossroad_type = 7
                break;
            }
        }
        IR_old = IR_new
    }
}
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
	
})
function testIR () {
    while (true) {
        IR_new = get_IR_Data()
        serial.writeNumbers(IR_new)
        line_position = BitRacer.readLine()
        serial.writeValue("line", line_position)
        basic.pause(500)
    }
}
function get_IR_Data () {
    IR = []
    for (let IR_no = 0; IR_no <= 4; IR_no++) {
        IR[IR_no] = BitRacer.readIR2(IR_no)
    }
    return IR
}
let IR: number[] = []
let IR_new: number[] = []
let IR_old: number[] = []
let crossroad_type: number = []
let tuen_ticks = 0
let move_ticks = 0
crossroad_type = 0
let goal_timer: number
let PD_Value: number
let delta_err: number
let trace_err_old: number
let trace_err: number
let line_position: number
line_position = 0
trace_err = 0
trace_err_old = 0
delta_err = 0
PD_Value = 0
IR_old = []
IR_new = []
let total_move_ticks = 40
let total_turn_ticks = 100
serial.redirectToUSB()
