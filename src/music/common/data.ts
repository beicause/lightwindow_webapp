
enum VoiceFrequency {
    do=261.632,
    re=293.672,
    mi=329.636,
    fa=349.237,
    so=392.005,
    la=440.010,
    si=493.895
}

const path=(name:string)=>(level=0):string=>level>=0?
    '/static/'+name+(level===0?'': level)+'.mp3'
    :'/static/'+name+0+(-level)+'.mp3'
class Voice {
    static do=path('c')
    static do_=path('cs')
    static re=path('d')
    static re_=path('ds')
    static mi=path('e')
    static fa=path('f')
    static fa_=path('fs')
    static so=path('g')
    static so_=path('gs')
    static la=path('a')
    static la_=path('as')
    static si=path('b')
    static getVoicePath=(name:'1'|'2'|'3'|'4'|'5'|'6'|'7',level=0,sharpe=false):string=>{
        if (sharpe&&(name==='3'||name==='7'))return ''
        if (![0,1,2,3,4,-1,-2,-3,-4].includes(level))return ''
        if (level===-4&&(name!=='6'&&name!=='7'))return ''
        if (level===4&&name!=='1')return ''

        switch (name) {
            case '1':return sharpe?Voice.do_(level):Voice.do(level)
            case '2':return sharpe?Voice.re_(level):Voice.re(level)
            case '3':return Voice.mi(level)
            case '4':return sharpe?Voice.fa_(level):Voice.fa(level)
            case '5':return sharpe?Voice.so_(level):Voice.so(level)
            case '6':return sharpe?Voice.la_(level):Voice.la(level)
            case '7':return Voice.si(level)
            default:return ''
        }
    }
}
export {VoiceFrequency,Voice}
