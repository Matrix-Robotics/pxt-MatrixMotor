MxMotor.init()
basic.forever(function () {
    serial.writeString("Battery=")
    serial.writeLine("" + (MxMotor.readVbat()))
    MxMotor.setPWM(MotorChannel.CH1, 255)
    MxMotor.setPWM(MotorChannel.CH2, -255)
})
    
