var question1load = function (){
var q1text = `
<div class="row incoming-question">

            <div class="col s12 m12">

                <div class="horizontal">

                    <div class="">
                        <div class="row">
                            <h4>What name do you hear
                                <a class="waves-effect waves-light btn-small">
                                    <i class="material-icons">play_circle_filled</i>
                                </a>
                            </h4>
                            <div class="col s6 m6 center">
                                <h5>"Laurel"</h5>
                                <div>
                                    <div id="questionLaurel" class="laurel guesses s12 m12">
                                        
                                    </div>
                                    <a id="laurel" class="waves-effect waves-light btn q1-btn" value="laurel">vote</a>
                                </div>

                            </div>
                            <div class="col s6 m6 center">
                                <h5>"Yanny"</h5>
                                <script type="text/javascript">
                                window.setTimeout(function(){
                                    question1load();
                                }, 3000);
                                </script>
                                <div>
                                    <div id="questionYanny" class="yanny guesses s12 m12">


                                    </div>
                                    <a id="yanny" class="waves-effect waves-light btn q1-btn" value="yanny">vote</a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
`
$("#chat-group").append(q1text);
};