var ctrl;


    document.addEventListener('DOMContentLoaded',function(event){
        ctrl = new MainCtrl();
    });
function MainCtrl(){
    
    var requestAnimationFrame = window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;
        window.requestAnimationFrame = requestAnimationFrame;

    this.$links=$("#links");
    this.$gitars = $('#gitars');
    this.sound=null;
    
    this.selectedKey=0;
    
    this.$cam = $('#cam');
    
    var self = this;
    AFRAME.registerComponent('cursor-listner',{
        init:function(){
            this.el.addEventListener('click',function(evt){
                console.log(this.dataset.gl);
                var key = this.dataset.gl.substr(0,1);
                var idnum = parseInt(this.dataset.gl.substr(1,1));
                switch(key){
                    case 'l':
                        self.selectGit(idnum);
                        break;
                    case 'g':
                        self.closeGit(idnum);
                        break;
                }
            })
        }
    });
    AFRAME.registerComponent('sound-rem',{
        init:function(){
            self.soundEfec();
            $('#cover').one('click',function(){
                self.sound.play();
                $(this).hide();
            });
        }
    });
    
    

}
MainCtrl.prototype.soundEfec = function () {
    if(this.sound)return;
    this.sound = new Howl({
  src: ['sound/rock.mp3'],
      autoplay: false,
      loop: true,
      volume: 1
    });
    var self = this;
    lookloop();

    function lookloop() {
        window.requestAnimationFrame(lookloop);
        var camRotation = self.$cam.attr("rotation");
        var targetDeg = -90
        var param = getPos(camRotation,targetDeg);
        self.sound.pos(param.x, param.y, param.z);
        self.sound.volume(((-param.z+9)/18*7+3)/10);
        
    }

    function getPos(rot,targetDeg) {
        var Yrad = dr(rot.y+targetDeg);
        var x = 9 * Math.sin(Yrad);
        var z = -9 * Math.cos(Yrad);
        return {
            x: x
            , y: 0
            , z: z
        };

        function dr(num) {
            return num * Math.PI / 180;
        }
    }
}

MainCtrl.prototype.selectGit = function(gidnum){
    var targetLink = $('#le'+gidnum);
    targetLink.attr('visible',false);
    if(this.selectedKey!=0){
        this.closeGit(this.selectedKey);
    }
    this.$gitars.html('');
    this.$gitars.html('<a-entity template="src: #git'+gidnum+'"></a-entity>');
    this.selectedKey=gidnum;
}

MainCtrl.prototype.closeGit = function(gidnum){
    var targetLink = $('#le'+gidnum);
    targetLink.attr('visible',true);
    this.$gitars.html('');
    this.selectedKey=0;
}