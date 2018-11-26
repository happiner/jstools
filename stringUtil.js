/**
 * 字符串相关工具类
 */
StringUtil = {

	/**
	 * 全角转换半角
	 */
	sbc2dbc: function(str){
		var result = "";
		for(var i = 0; i < str.length; i++){
			var u = str.charCodeAt(i);
			if(u == 12288){
				result += String.fromCharCode(u - 12256);
				continue;
			}
			if(u > 65280 && u < 65375){
				result += String.fromCharCode(u - 65248);
			}else{
				result += String.fromCharCode(u);
			}
		}
		return result;
	},
	
	/**
	 * 去除字符串左侧零
	 * @param {Object} str
	 */
	clearLeft0: function(str){
		if(!str){
			return "";
		}
		return str.replace(/^0+/g, "");
	},
	
	/**
	 * 将手机号码中间位数替换为星号
	 * @param mobile
	 */
	maskMobile: function (mobile) {
        return mobile?mobile.substr(0, 3) + '****' + mobile.substr(7, 4):mobile;
    },
    /**
     * @Author   xl Gui
     * @Created  2015/10/10
     * @Tips 替换email，在@前字符长度小于等于3个时，用***代替，当大于3个时XXX***代替
     * 例如：abc@126.com 替换为：***@126.com   abcde@126.com 替换为：abc***@126.com    
     */
    maskEmail: function (email) {
    	if(email.indexOf("@")==-1){
    		return email;
    	}
    	var list=email.split("@");
        return (list[0].length>3?list[0].substr(0,3):"")+"***@"+list[1];
    },
    /**
     * 将账号中间位替换为星号
     * 规则：保留前四后四位
     * @param account
     */
    maskAccount: function(account){
    	//return account.substr(0, 4) + account.substr(0,account.length-8).replace(/\w/g,"*") + account.substr(account.length-4,4);
    	//13.3.25
    	if(account){
            account += "";
            if(account.length<8){//长度小于8时显示前2个字符和后2个字符中间有几个字符就显示几个*号
                var str="",len=account.length-4;
                while(len>0){
                    str+="*";
                    len--;
                }
                return account.substr(0,2)+str+account.substr(account.length-2);
            }else{
        	   return account.substr(0, 4) + "******" + account.substr(account.length - 4, 4);
            }
    	}else{
    		return "";
    	}
    },
    
    /**
     * 将证件号码中间位替换为星号
     * 规则：保留前一位后一位
     * @param account
     */
    maskIdentity: function(identity){
        if(identity){
            var len = identity.length,str="",i=0;
            if(len>2){
            	for(i=0;i<len-2;i++){
            		str+="*";
            	}
            	identity=identity.substring(0,1)+str+identity.substring(len-1);
            }
        }else{
        	identity="";
        }
        return identity;
    },
    /**
     * 截取字符串部分字符（区分中英文，中文占两个字符）
     * @param str 被截取的字符串
     * @param start 开始的索引
     * @param len 需要截取的长度
     * @returns 被截取出来的字符串
     */
    substring: function(str, start, len){
    	if(typeof str != "string"){
    		return "";
    	}
    	var arr = str.split(""),
    	h = 0;
    	result = "";
    	for(var i = start; i < str.length; i++){
    		result += arr[i];
    		h += arr[i].len();
    		if(h >= len){
    			break;
    		}
    	}
    	return result;
    },
    /**
     * 要获得后4位 (可兼容数字 0除外)
     * @param str
     * @returns
     */
    lastFourDigits:function(str){
    	//如果什么都不传 就返回 "";
    	if(!str){
    		return "";
    	}
    	str+="";
    	if(str.length<4){
    		return str;
    	}
    	return str.substr(str.length - 4, 4);
    },
    //js精度损失 
    //5194.49+5194.49 --->10388.98
    //5488.63+5194.49 --->10683.119999999999
    fixedPrecisionLoss:function(arraySum,digit){
    	var sum = 0,
        i = 0,k=Math.pow(10, digit);
	    for (i = 0; i < arraySum.length; i++) {
	        sum +=  k* arraySum[i];
	    }
	    sum = sum /k;
	    return sum;
    },
    /**
     * 周佛佑 2016年12月6日16:28:25 带有小数点的数字运算，会出现精度损失，用以下方法替换
     */
	toInteger:function(num) {
            var nums = num + "";
            var match = /\./.exec(nums);
            var placesLen = (match && match.index) ? nums.length - match.index - 1 : 0;
            var inum = +(nums.replace('.', ''));
            while (inum!==0 && inum/10 % 1 === 0) {
                inum = inum/10;
                placesLen--;
            }
            return [inum, placesLen];
        },
        toDecimal:function(numArr) {
            //去掉小数位后面多余的0
            /*while (numArr[0]/10 % 1 === 0 && numArr[1] > 0) {
                numArr[0] = numArr[0]/10;
                numArr[1]--;
            }*/
            var nums = (numArr[0] + "");
            var p = nums.length - numArr[1];
            //前面不够，补0
            while (p < 1){
                nums = '0' + nums;
                p ++;
            }
            //后面不够，补0
            while(p > nums.length){
                nums += '0';
            }
            var ipart = nums.substr(0, p);
            return ( +(ipart + "." + nums.substr(p)));
        },
        calc: function(num1, num2, type){
            var result = [];
            var numA1 = this.toInteger(num1);
            var numA2 = this.toInteger(num2);
            switch (type){
                case '*':
                    result[0] = numA1[0] * numA2[0];
                    result[1] = numA1[1] + numA2[1];
                    break;
                case "+":
                    if(numA1[1] > numA2[1]){
                        numA2[0] = numA2[0] * Math.pow(10, numA1[1] - numA2[1]);
                        numA2[1] = numA1[1];
                    }else{
                        numA1[0] = numA1[0] * Math.pow(10, numA2[1] - numA1[1]);
                        numA1[1] = numA2[1];
                    }
                    result[0] = numA1[0] + numA2[0];
                    result[1] = numA1[1];
                    break;
                case "-":
                    return this.calc(num1,-num2, "+");
                case "/":
                    var num = numA1[0]/numA2[0];
                    var numA = this.toInteger(num);
                    result[0] = numA[0];
                    result[1] = numA[1] + numA1[1] - numA2[1];
                    break;
            }
            return this.toDecimal(result);
        },
        calcAll: function(numArr, type){
            var num = numArr[0];
            for(var i=1; i<numArr.length; i++) {
                num = this.calc(num, numArr[i], type);
            }
            return num;
        },
        /**
         *获取年龄,日期格式支持19881011 ，"1988/10/11"，"1988-10-11"
         *@param birthday 出生日期
         *@param sysdate 当前日期
         */
        getAge:function(birthday,sysdate){
            if(birthday) birthday = (birthday+"").replace(/-/g,"").replace(/\//g,"");
            if(sysdate) sysdate = (sysdate+"").replace(/-/g,"").replace(/\//g,"");

            if(birthday && birthday.length == 8 && sysdate && sysdate.length == 8){
                var age,
                    reachFlag=false,
                    b_year = parseInt(birthday.substring(0,4)),
                    b_month = parseInt(birthday.substring(4,6)),
                    b_day = parseInt(birthday.substring(6,8)),
                    s_year = parseInt(sysdate.substring(0,4)),
                    s_month = parseInt(sysdate.substring(4,6)),
                    s_day = parseInt(sysdate.substring(6,8));
                if(s_month-b_month>0){//足月
                    reachFlag = true;
                }else if(s_month == b_month){
                    //足日
                    if(s_day >= b_day) reachFlag = true;
                }
                if(reachFlag){
                    age = s_year - b_year;
                }else{
                    age = s_year - b_year - 1;
                }
            }else{
                age = 0;
            }
            return age;
        },
        _cipherKey:"AzNDI2"
};