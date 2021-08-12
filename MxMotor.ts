let __REV = 0

enum MotorChannel
{
    CH1 = 1,
    CH2,
    CH3,
    CH4
}

//% weight=3 Motor=#8022be icon="f0b2" block="MxMotor"
namespace MxMotor{

    const MxMotor_ADDR = 0x25

    enum MotorReg
    {
        Device_ID = 1,
        Device_Control_1,
        Device_Control_2,
        Battery_Voltage,
    }

    /**
     *start up the motor extension
    */
    //%block="start up the motor extension"
    //%weight=994 inlineInputMode="external" %blockID="MxMotor_init"
    export function init(): void {

        if(i2cRead(MotorReg.Device_ID) == 0x45){
            i2cWrite(MotorReg.Device_Control_1, 0x08); // reset
            basic.pause(500);
            i2cWrite(MotorReg.Device_Control_1, 0x00); // module enable
            i2cWrite(MotorReg.Device_Control_2, 0xF0); // channel enable
        }
    }

    /**
     *set Motor speed
     *@param ch [1-4] select the channel of Motor; eg: 1, 4
     *@param PWM [-255-255] set the PWM of Motor; eg: -100, 180
    */
    //%block="set %ch Motor to %speed"
    //%weight=94 %blockID="MxMotor_PWM"
    //% speed.min=-255 speed.max=255
    export function setPWM(ch: MotorChannel, speed: number): void {
        if(speed > 0){
            setREV(ch, false)
        }
        else{
            setREV(ch, true)
            speed *= -1
        }
        i2cWrite(ch+4, speed)
    }

    function setREV(ch: MotorChannel, dir: boolean): void {
        let shift = 1 << (4-ch)
        
        if(dir){
            __REV |= shift
        }
        else{
            let mask = 0x0F - shift
            __REV &= mask
        }
        
        i2cWrite(MotorReg.Device_Control_2, 0xF0+__REV)
    }

    /**
     *read voltage of motor extension
    */
    //%block="read voltage of motor extension"
    //%weight=92 %blockID="MxMotor_Vbat"
    export function readVbat(): number{
        return i2cRead(MotorReg.Battery_Voltage)*0.033
    }

    function i2cWrite(reg: number, value: number): void {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(MxMotor_ADDR, buf)
    }  
    
    function i2cRead(reg: number): number {
        pins.i2cWriteNumber(MxMotor_ADDR, reg, NumberFormat.UInt8LE)
        return pins.i2cReadNumber(MxMotor_ADDR, NumberFormat.UInt8LE, false)
    } 
}
