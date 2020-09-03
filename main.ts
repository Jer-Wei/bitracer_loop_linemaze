input.onButtonPressed(Button.AB, function () {
    basic.showIcon(IconNames.Ghost)
    basic.pause(1000)
    BitRacer.CalibrateBegin()
    BitRacer.motorRun(BitRacer.Motors.All, 250)
    basic.pause(600)
    BitRacer.motorRun(BitRacer.Motors.All, 0)
    BitRacer.CalibrateEnd(BitRacer.LineColor.White)
    basic.showIcon(IconNames.Yes)
})
let IR_new: number[] = []
let IR_old: number[] = []
let crossroad_type = 0
let line_position = 0
let trace_err = 0
let trace_err_old = 0
let delta_err = 0
let Kd = 0
let Kp = 0
let PD_Value = 0
let move_ticks = 0
let total_move_ticks = 40
let tuen_ticks = 0
let total_turn_ticks = 100
let goal_timer = 0
