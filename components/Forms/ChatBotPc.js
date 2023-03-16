import { ChatBot } from 'aws-amplify-react';
export class ChatBotPc extends ChatBot {
    lastidx = -1;
    speakable = true;

    constructor(props) {
        super(props);
        this.doneSpeakingHandler = this.doneSpeakingHandler.bind(this);                

        if (this.props.initHistory && this.props.initHistory.length > 0) {
            this.state.dialog = this.props.initHistory;
            this.speakable = false;
        }

        setTimeout(() => {            
            this.onTimer();    
        }, 200);  
    }

    doneSpeakingHandler = () =>
    {           
        this.reset();  
    };   

    onTimer = () => {
        if (this.state.dialog && this.state.dialog.length > 0 && this.state.dialog.length != this.props.initHistory) {
            const idx = this.state.dialog.length - 1;
            const from = this.state.dialog[idx].from;
            const message = this.state.dialog[idx].message;
            if (from == 'me') {
                
            }
            else {
                if (this.lastidx != idx) {                                    
                    this.props.funcTextToSpeech(message, this.state.dialog, this.speakable);   
                    this.speakable = true; 
                    if (this.lastidx == -1) {
                        for (var i=0; i<this.state.dialog.length; i++) {
                            const _from = this.state.dialog[i].from;
                            const _message = this.state.dialog[i].message;
                            if (_from == 'bot' && _message.indexOf("I will test the website: ") != -1) {
                                var fields_msg = _message.split(": ");
                                if (fields_msg.length > 1) {
                                    var subfield = fields_msg[1];      
                                    var subfield2 = subfield.split(". You can");                                                  
                                    if (this.props.onChangedWebsites != null) {
                                        this.props.onChangedWebsites(subfield2[0]);
                                    }
                                }    
                            }
                        }
                    }
                    else {
                        if (message.indexOf("I will test the website: ") != -1) {
                            var fields_msg = message.split(": ");
                            if (fields_msg.length > 1) {
                                var subfield = fields_msg[1];      
                                var subfield2 = subfield.split(". You can");                                                  
                                if (this.props.onChangedWebsites != null) {
                                    this.props.onChangedWebsites(subfield2[0]);
                                }
                            }                        
                        }
                    }                    

                    this.lastidx = idx;
                }                
            }
        }
        setTimeout(() => {            
            this.onTimer();    
        }, 200);  
    };
}

/**
 * @deprecated use named import
 */
export default ChatBotPc;