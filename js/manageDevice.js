
class device 
{
    constructor(){
        this.devEui;
        this.devName;
        this.ABP = {
            devAddress:undefined,
            appsKey:undefined,
            nwksKey:undefined
        };
        this.OTAA = {
            appEui:undefined,
            appKey:undefined,
            last_join_ts:0
        };
        this.frequencyPlan = {
            freq4:864100000,
            freq5:864300000,
            freq6:864500000,
            freq7:864700000,
            freq8:864900000
        };
        this.channelMask = {
            channel1En:true,
            channel2En:true,
            channel3En:true,
            channel4En:true,
            channel5En:true,
            channel6En:true,
            channel7En:true,
            channel8En:true,
            channel9En:false,
            channel10En:false,
            channel11En:false,
            channel12En:false,
            channel13En:false,
            channel14En:false,
            channel15En:false,
            channel16En:false,
        };
        this.position = {
            longitude:0,
            latitude:0,
            altitude:0
        };
        this.class='CLASS_A';
        this.rxWindow= 1;
        this.delayRx1= 1;
        this.delayJoin1= 5;
        this.drRx2= '0';
        this.freqRx2=869100000;
        this.adr;
        this.preferDr= 5;
        this.preferPower= 14;
        this.fcnt_up;
        this.fcnt_down;
        this.last_data_ts;
        this.lastRssi;
        this.lastSnr;
        this.totalNum;
        this.reactionTime;
        this.useDownlinkQueueClassC = false;
        this.serverAdrEnable = true;
    }
    valid_data()
    {
        
        if(this.valid_reg_data()&&((this.valid_clean_ABP()||this.valid_clean_OTAA())||(!this.valid_clean_OTAA()&&!this.valid_clean_ABP())))
        {
            if((valid.valid(this.devName)||this.devName==undefined||this.devName=="")&&valid.devEui(this.devEui)&&valid.device_class(this.class))
            {
               if((valid.isNumber(this.position.longitude)||this.position.longitude==0||this.position.longitude=="")&&(valid.isNumber(this.position.latitude)||this.position.latitude==0||this.position.latitude=="")&&(valid.isNumber(this.position.altitude)||this.position.altitude==0||this.position.altitude==""))
               {
                   var ok = true;
                   for(var key in this.frequencyPlan)
                   {
                       if(!valid.isFrequency(this.frequencyPlan[key]))
                       {
                           ok=false;
                           break;
                       }
                   }
                   if(!ok)
                   {
                       console.log('Error  frequencyPlan');
                       return false;
                   }
                   else {
                       if(valid.isBool(this.useDownlinkQueueClassC)&&valid.isBool(this.serverAdrEnable)&&valid.oneortwo(this.rxWindow)&&valid.num1_15(this.delayRx1)&&valid.num1_15(this.delayJoin1)&&valid.num0_5(this.drRx2)&&valid.preferPower(this.preferPower))
                       {
                           
                            return true;
                           
                       }
                       else
                       {
                           console.log('Error информации для добавления');
                           return false;
                       }
                   }
               }
               else
               {
                    console.log('Error  position');
                    return false;
               }
            }
            else
            {
                console.log('Error main setting');
                return false;
            }
            
        }
        else
        {
            console.log('Error в регистрационной информации');
            return false;
        }
    }
    frequency_change(num)
    {
        var frequencyPlan = this.frequencyPlan;
        if(num='pattern')
        {
            for(var key in frequencyPlan)
            {
                var num = key.replace('freq','');
                var freq = frequencyPlan[key];
                if(freq==0)
                {
                    this.channelMask['channel'+num+'En'] = false;
                }
                else
                {
                     this.channelMask['channel'+num+'En'] = true;
                }
            }
        }
        else
        {
            var freq = frequencyPlan['freq'+num];
            if(freq==0)
            {
                this.channelMask['channel'+num+'En'] = false;
            }
        }
    }
    check_pattern()
    {
        if(this.pattern!=3)
        {
            this.freqRx2=this.freqplan_patterns[this.pattern-1][0];
            this.frequencyPlan.freq4=this.freqplan_patterns[this.pattern-1][1];
            this.frequencyPlan.freq5=this.freqplan_patterns[this.pattern-1][2];
            this.frequencyPlan.freq6=this.freqplan_patterns[this.pattern-1][3];
            this.frequencyPlan.freq7=this.freqplan_patterns[this.pattern-1][4];
            this.frequencyPlan.freq8=this.freqplan_patterns[this.pattern-1][5];
            this.frequency_change('pattern');
        }
      
    }
    valid_clean_ABP()
    {
        if((this.ABP.devAddress==""||this.ABP.devAddress==undefined)&&(this.ABP.appsKey==""||this.ABP.appsKey==undefined)&&(this.ABP.nwksKey==""||this.ABP.nwksKey==undefined))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    valid_clean_OTAA()
    {
        if((this.OTAA.appEui==""||this.OTAA.appEui==undefined)&&(this.OTAA.appKey==""||this.OTAA.appKey==undefined))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    valid_reg_data()
    {
        return (this.valid_ABP()||this.valid_OTAA())?true:false;
    }
    valid_ABP()
    {
        if(valid.devAddress(this.ABP.devAddress)&&this.ABP.devAddress!=''&&this.ABP.devAddress!=undefined&&this.ABP.appsKey!=''&&this.ABP.appsKey!=undefined&&valid.byte16(this.ABP.appsKey)&&valid.byte16(this.ABP.nwksKey)&&this.ABP.nwksKey!=''&&this.ABP.nwksKey!=undefined)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    valid_OTAA()
    {
        if(valid.byte16(this.OTAA.appKey)&&this.OTAA.appKey!=undefined&&this.OTAA.appKey!='')
        {
            if(valid.byte8(this.OTAA.appEui)||this.OTAA.appEui==""||this.OTAA.appEui==undefined)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    get_reg_info()
    {
        var ABP=false;
        var OTAA=false;
        if(this.ABP!=undefined&&this.ABP.devAddress!=undefined&&this.ABP.appsKey!=undefined&&this.ABP.nwksKey!=undefined)
        {
            ABP=true;
        }
        if(this.OTAA!=undefined&&this.OTAA.appKey!=undefined)
        {
            OTAA=true;
        }
        if(ABP&&OTAA)
        {
            return "ABP+OTAA"
        }
        else if(ABP)
        {
             return "ABP"
        }
        else if(OTAA)
        {
            return "OTAA"
        }
        else
        {
            return "-"
        }
    }
    get_title()
    {
        if(this.devName==undefined||!valid.devEui(this.devEui))
        {
            return "Добавление нового устройства";
        }
        else
        {
            if(valid.valid(this.devName)&&this.devName!=""&&this.devName!=0)
            {
                return "Редактируемое устройство "+this.devName;
            }
            else
            {
                return "Редактируемое устройство "+this.devEui;
            }
        }
    }
    auto_pattern()
    {
        var ok=false;
        for(var i = 0 ; i<this.freqplan_patterns.length;i++)
        {
            var pattern = this.freqplan_patterns[i];
            if(pattern[0]==this.freqRx2&&pattern[1]==this.frequencyPlan.freq4&&pattern[2]==this.frequencyPlan.freq5&&pattern[3]==this.frequencyPlan.freq6&&pattern[4]==this.frequencyPlan.freq7&&pattern[5]==this.frequencyPlan.freq8)
            {
                ok=true;
                this.pattern=(i+1).toString();
                break;
            }
        }
        if(!ok)
        {
            this.pattern='3';
        }
    }
    set_device(obj)
    {   
        if(valid.devEui(obj.devEui))
        {
            this.devEui=obj.devEui;
        }
        else{ 
            return false;
        }
        if(valid.device_class(obj.class))
        {
            this.class=obj.class;
        }
        else{
            return false;
        }
        if(valid.valid(obj.devName))
        {
            this.devName=obj.devName;
        }
        else
        {
            this.devName=undefined;
        }
        if(obj.ABP==undefined&&obj.OTAA==undefined)
        {
            return false;
        }
        else
        {
            var ABP=false;
            var OTAA=false;
            
            if(obj.ABP!=undefined)
            {
                if(obj.ABP.devAddress!=undefined&&valid.isNumber(obj.ABP.devAddress))
                {
                    obj.ABP.devAddress=int_to_hex(obj.ABP.devAddress);
                }
                if(!(valid.devAddress(obj.ABP.devAddress)||valid.byte16(obj.ABP.appsKey)||valid.byte16(obj.ABP.nwks)))
                {
                    ABP=false;
                }
                else
                {
                    ABP=true;
                    this.ABP = obj.ABP;
                    
                }
            }
            if(obj.OTAA!=undefined)
            {
                 if(!valid.byte16(obj.OTAA.appKey))
                {
                   OTAA=false;
                }
                else
                {
                    OTAA=true;
                    this.OTAA = obj.OTAA;
                }
            }
            if(!OTAA&&!ABP)
            {
                return false;
            }
    
        }
        
        
        if(obj.channelMask!=undefined)
        {
            (valid.isBool(obj.channelMask.channel1En))?this.channelMask.channel1En=obj.channelMask.channel1En:this.channelMask.channel1En=true;
            (valid.isBool(obj.channelMask.channel2En))?this.channelMask.channel2En=obj.channelMask.channel2En:this.channelMask.channel2En=true;
            (valid.isBool(obj.channelMask.channel3En))?this.channelMask.channel3En=obj.channelMask.channel3En:this.channelMask.channel3En=true;
            (valid.isBool(obj.channelMask.channel4En))?this.channelMask.channel4En=obj.channelMask.channel4En:this.channelMask.channel4En=true;
            (valid.isBool(obj.channelMask.channel5En))?this.channelMask.channel5En=obj.channelMask.channel5En:this.channelMask.channel5En=true;
            (valid.isBool(obj.channelMask.channel6En))?this.channelMask.channel6En=obj.channelMask.channel6En:this.channelMask.channel6En=true;
            (valid.isBool(obj.channelMask.channel7En))?this.channelMask.channel7En=obj.channelMask.channel7En:this.channelMask.channel7En=true;
            (valid.isBool(obj.channelMask.channel8En))?this.channelMask.channel8En=obj.channelMask.channel8En:this.channelMask.channel8En=true;
            
            (valid.isBool(obj.channelMask.channel9En))?this.channelMask.channel9En=obj.channelMask.channel9En:this.channelMask.channel9En=false;
            (valid.isBool(obj.channelMask.channel10En))?this.channelMask.channel10En=obj.channelMask.channel10En:this.channelMask.channel10En=false;
            (valid.isBool(obj.channelMask.channel11En))?this.channelMask.channel11En=obj.channelMask.channel11En:this.channelMask.channel11En=false;
            (valid.isBool(obj.channelMask.channel12En))?this.channelMask.channel12En=obj.channelMask.channel12En:this.channelMask.channel12En=false;
            (valid.isBool(obj.channelMask.channel13En))?this.channelMask.channel13En=obj.channelMask.channel13En:this.channelMask.channel13En=false;
            (valid.isBool(obj.channelMask.channel14En))?this.channelMask.channel14En=obj.channelMask.channel14En:this.channelMask.channel14En=false;
            (valid.isBool(obj.channelMask.channel15En))?this.channelMask.channel15En=obj.channelMask.channel15En:this.channelMask.channel15En=false;
            (valid.isBool(obj.channelMask.channel16En))?this.channelMask.channel16En=obj.channelMask.channel16En:this.channelMask.channel16En=false;
        }
        else
        {
            this.channelMask.channel1En=false;
            this.channelMask.channel2En=false;
            this.channelMask.channel3En=false;
            this.channelMask.channel4En=false;
            this.channelMask.channel5En=false;
            this.channelMask.channel6En=false;
            this.channelMask.channel7En=false;
            this.channelMask.channel8En=false;
            
            this.channelMask.channel9En=false;
            this.channelMask.channel10En=false;
            this.channelMask.channel11En=false;
            this.channelMask.channel12En=false;
            this.channelMask.channel13En=false;
            this.channelMask.channel14En=false;
            this.channelMask.channel15En=false;
            this.channelMask.channel16En=false;
        }
        if(obj.position!=undefined)
        {
            (valid.isNumber(obj.position.longitude))?this.position.longitude=obj.position.longitude:this.position.longitude=0;
            (valid.isNumber(obj.position.latitude))?this.position.latitude=obj.position.latitude:this.position.latitude=0;
            (valid.isNumber(obj.position.altitude))?this.position.altitude=obj.position.altitude:this.position.altitude=0;
        }
        else
        {
            this.position.longitude=undefined;
            this.position.latitude=undefined;
            this.position.altitude=undefined;
        }
        if(valid.valid(obj.fcnt_up))
        {
            this.fcnt_up=obj.fcnt_up;
        }
        else
        {
            this.fcnt_up=undefined
        }
        if(valid.valid(obj.fcnt_down))
        {
            this.fcnt_down=obj.fcnt_down;
        }else {this.fcnt_down=undefined}
        if(obj.last_data_ts!=undefined&&obj.last_data_ts>0)
        {
            this.last_data_ts=obj.last_data_ts;
        }
        else
        {
            this.last_data_ts=undefined;
        }
        
        if(valid.num0_5(obj.preferDr))
        {
            this.preferDr=obj.preferDr.toString();
        }
        else
        {
            this.preferDr='5';
        }
        if(valid.preferPower(obj.preferPower))
        {
            this.preferPower=obj.preferPower.toString();
        }
        else
        {
            this.preferPower='14';
        }
        
       if(valid.num0_5(obj.drRx2))
        {
            this.drRx2=obj.drRx2.toString();
        }
        else
        {
            this.drRx2='0';
        }
        if(valid.isBool(obj.useDownlinkQueueClassC))
        {
            this.useDownlinkQueueClassC=obj.useDownlinkQueueClassC;
        }
        else
        {
            this.useDownlinkQueueClassC=false;
        }
        if(valid.isBool(obj.serverAdrEnable))
        {
            this.serverAdrEnable=obj.serverAdrEnable;
        }
        else
        {
            this.serverAdrEnable=true;
        }
        if(valid.isNumber(obj.freqRx2))
        {
            this.freqRx2=obj.freqRx2;
        }
        else
        {
            this.freqRx2=undefined;
        }
        if(valid.isNumber(obj.reactionTime))
        {
            this.reactionTime=obj.reactionTime;
        }
        else
        {
            this.reactionTime=1000;
        }
        if(valid.isNumber(obj.delayRx1))
        {
            this.delayRx1=obj.delayRx1.toString();
        }
        else
        {
            this.delayRx1='1';
        }
        if(valid.isNumber(obj.rxWindow))
        {
            this.rxWindow=obj.rxWindow.toString();
        }
        else
        {
            this.rxWindow='2';
        }
         if(valid.isNumber(obj.delayJoin1))
        {
            this.delayJoin1=obj.delayJoin1.toString();
        }
        else
        {
            this.delayJoin1='5';
        }
        this.auto_pattern();
        this.group = obj.group!==undefined&&obj.group!==''?obj.group:'';
        return this;
    }
}
class valid_data 
{
    constructor()
    {
        
    }
    device_access(str)
    {
        if(this.valid(str))
        {
            if(str=='FULL'||str=='SELECTED')
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    direction(str)
    {
        if(this.valid(str))
        {
            if(str=='UPLINK'||str=='DOWNLINK'||str=='ALL')
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    oneortwo(num)
    {
        return (num==1||num==2)?true:false;
    }
    num1_15(num)
    {
        return (this.isInt(num)&&(num>=1&&num<=15))?true:false;
    }
    num0_5(num)
    {
        return (this.isInt(num)&&(num>=0&&num<=5))?true:false;
    }
    preferPower(num)
    {
        return (this.isInt(num))?true:false;
    }
    bit32(num)
    {
        if(num<33554431&&num>=0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    isParity(num)
    {
       if(this.isInt(num)&&num % 2 === 0)
       {
           return true;
       }
       else
       {
            return false;
       }
    }
    isData(data)
    {
        if(this.simbol16(data)&&data.length<=444&&this.isParity(data.length))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    isPort(num)
    {
        if(this.isInt(num)&&num>=0&&num<=255)
        {
            return true
        }
        else
        {
            return false;
        }
    }
    device_class(str)
    {
        if(str=="CLASS_A"||str=="CLASS_C")
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    simbol16(str)
    {
        if(str!=undefined)
        {
            for(var i =0; i <str.length;i++)
            {
               if(! ((str[i].charCodeAt()>=48&&str[i].charCodeAt()<=57)||(str[i].charCodeAt()>=65&&str[i].charCodeAt()<=70)||(str[i].charCodeAt()>=97&&str[i].charCodeAt()<=102)))
               { 
                   return false;
               }
              
            }
            return true;
        }
        else
        {
            return false;
        }
    }
    devAddress(num)
    {
        if(this.simbol16(num))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    byte16(str)
    {
        if(str!=undefined&&str.length==32)
        {
          return  this.simbol16(str);
        }
        else
        {
            return false;
        }
    }
     byte8(str)
    {
        if(str!=undefined&&str.length==16)
        {
          return  this.simbol16(str);
        }
        else
        {
            return false;
        }
    }
    valid(str)
    {
        if(str!=undefined&&str.length>0)
        {
            return true;
        }
        else
        {
            return false;
        }
        
    }
    name(str)
    {
        if(this.valid(str)&&str.length<=25)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    comment(str)
    {
        if(this.valid(str)&&str.length<=200)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    address(str)
    {
        if(this.valid(str)&&str.length<=200)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    isInt(str)
    {
        if(this.isNumber(str)&&str % 1 == 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    devEui(str)
    {
        return (this.valid(str)&&str.length==16);
    }
    isFrequency(num)
    {
        if((this.isNumber(num)&&num<=1020000000&&num>=862000000)||num==0||num=='0')
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    isNumber(str)
    {
        if(str!=undefined&&!isNaN(parseFloat(str))&&str!=='')
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    isBool(str)
    {
        if(typeof(str)=="boolean")
        {
            return true;
        }
        else return false;
    }
    isDate(str)
    {
        if(str!=undefined)
        {
            try
            {
                var date = Math.abs(new Date(str).getTime());
                if(date>0&&this.isInt(date))
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch(err)
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
}
var valid = new valid_data();