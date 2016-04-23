
window.onload = function(){
    var socket = io.connect();

    var users=[];

    var user_id= new Object();
    var my_name;
    socket.on('connect',function(){
    socket.on('getusers',function(usr){
        users = usr;
    })  ;
        socket.on('announcement',function(msg){
            var div = document.createElement('div');
            var li = '<li class="left clearfix"><span class="chat-img pull-left">'+
                '<img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" />'+
                '</span>'+
                '<div class="chat-body clearfix">'
                + '<div class="header">'
                +' <strong class="primary-font">'+'server says : '+'</strong> <small class="pull-right text-muted">'
                + ' <span class="glyphicon glyphicon-time"></span>'+getTime()+'</small>'
                +  ' </div>'
                +' <p>'
                +msg+
                '</p>'
                +'</div>'
                +'</li>'  ;
            div.innerHTML = li;
            document.getElementById('messages').appendChild(div);

        });

        socket.on('users',function(arr_usr){
            users = arr_usr;
        });
        socket.on('online',function(msg){
            my_name=msg;
            document.getElementById('stat').innerHTML = "";
            document.getElementById('to').innerHTML = "";
            for(var i =0;i<users.length;i++)
            {	console.log('users are '+ users);
                var li;
                var div = document.createElement('div');
                div.id=users[i];
             li = '<li class="left clearfix"><span class="chat-img pull-left">'+
                '<img src="/images/circle.jpg" alt="User Avatar" class="img-circle" />'+
                '</span>'+
                '<div class="chat-body clearfix">'
                    + '<div class="header">'
                        +' <strong class="primary-font">'+'online user nickname '+'</strong> <small class="pull-right text-muted">'
                            + ' <span class="glyphicon glyphicon-time"></span>'+' '+'</small>'
                        +  ' </div>'
                    +' <p><b><i>'
                        +users[i]+
                        '</i></b></p>'
                    +'</div>'
                +'</li>'  ;
                div.innerHTML = li;
                document.getElementById('stat').appendChild(div);

                var op = document.createElement('option');
                op.innerHTML = users[i];
                document.getElementById('to').appendChild(op);

            }


        });

        socket.on('offline',function(name){
        
            document.getElementById('stat').innerHTML ="";
            document.getElementById('to').innerHTML = "";
            for(var i =0;i<users.length;i++)
            {	console.log('users are '+ users);
                var li;
                var div = document.createElement('div');
                div.id=users[i];

                li = '<li class="left clearfix"><span class="chat-img pull-left">'+
                    '<img src="/images/circle.jpg" alt="User Avatar" class="img-circle" />'+
                    '</span>'+
                    '<div class="chat-body clearfix">'
                    + '<div class="header">'
                    +' <strong class="primary-font">'+'online user nickname '+'</strong> <small class="pull-right text-muted">'
                    + ' <span class="glyphicon glyphicon-time"></span>'+' '+'</small>'
                    +  ' </div>'
                    +' <p><b><i>'
                    +users[i]+
                    '</i></b></p>'
                    +'</div>'
                    +'</li>'  ;
                div.innerHTML = li;
                document.getElementById('stat').appendChild(div);

                var op = document.createElement('option');
                op.innerHTML = users[i];
                document.getElementById('to').appendChild(op);

            }

        });
        socket.on('discon',function(name){
            var li = document.createElement('li');
            li.className ='announcement';
            li.innerHTML = name +"  is disconnected...";
            document.getElementById('messages').appendChild(li);

        });
    });
    function getTime(){
        var date = new Date();
        var time ;
        time = date.getHours()+" : "+date.getMinutes()+" : "+date.getSeconds();
        return time;
    }
    function addMessage(from, text){
        var li;
          var div = document.createElement('div');
        if(from == 'me'){
            li = '<li class="left clearfix"><span class="chat-img pull-right">'+
                '<img src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar" class="img-circle" />'+
                '</span>'+
                '<div class="chat-body clearfix">'
                + '<div class="header">'
                +' <strong class="primary-font">'+from+'</strong> <small class="pull-right text-muted">'
                + ' <span class="glyphicon glyphicon-time"></span>'+getTime()+'</small>'
                +  ' </div>'
                +' <p>'
                +text+
                '</p>'
                +'</div>'
                +'</li>'  ;

        }
        else{
            li = '<li class="left clearfix"><span class="chat-img pull-left">'+
                '<img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" />'+
                '</span>'+
                '<div class="chat-body clearfix">'
                + '<div class="header">'
                +' <strong class="primary-font">'+from+'</strong> <small class="pull-right text-muted">'
                + ' <span class="glyphicon glyphicon-time"></span>'+getTime()+'</small>'
                +  ' </div>'
                +' <p>'
                +text+
                '</p>'
                +'</div>'
                +'</li>'  ;

        }

        div.innerHTML = li;
        document.getElementById('messages').appendChild(div);
        return(li);

    }


    var input = document.getElementById('btn-input');
    document.getElementById('btn-chat').onclick = function(){
        var li = addMessage('me',input.value);

        socket.emit('text', input.value,function (date) {

            li.className = 'confirmed';

            li.title = date;});


        input.value = '';

        input.focus();


        return false;

    }

    var to = document.getElementById('to');
    var pvtmsg = document.getElementById('pvtmsg');
    var button = document.getElementById('but');
    button.onclick = function(){
        var msg=[];
        msg.push(to.value);
        msg.push(pvtmsg.value);

        console.log(to.value+"   "+ pvtmsg.value);

        socket.emit('pvt_',msg);

    }


    socket.on('text', addMessage);






    document.getElementById('butt').onclick = checkName;

    function checkName(){
        var p =document.createElement('p');
        p.id="sel_name";
        document.getElementById('inputs').appendChild(p);



        console.log('on check Name');
        var name = document.getElementById('name_box').value;
        if(name == "")
        {
            var p =document.getElementById('sel_name')
            p.innerHTML = '<b><i>You can not leave it empty.</i></b>'
            return;

        }
        for(var i=0; i<users.length;i++){

            if(users[i] == name)
            {
                 var p =document.getElementById('sel_name')
                p.innerHTML = '<b><i>This name is already selected.</i></b>'

                return;
            }

        }
        my_name = name;
        window.document.getElementById('inputs').style.display = 'none';
        window.document.getElementById('chat').style.display = 'block';
        window.document.getElementById('chats').style.display = 'block';
        window.document.getElementById('statbox').style.display = 'block';
        socket.emit('join',name);

    }



}

