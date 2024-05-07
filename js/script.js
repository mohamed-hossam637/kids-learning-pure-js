window.addEventListener('load' , ()=>{
    let startGameBtn = document.getElementById('start');
    let homeSection = document.getElementById('home');
    
    let scoreBox = document.querySelector('.score-box');
    let progress = document.querySelector('.progress')
    let questionCount = document.querySelector('#question-count');
    let score = document.getElementById('current-score');
    let currentScore = 0
    score.innerText = currentScore
    
    let topicTitle = document.querySelector('.topic-title');

    let answers = document.querySelector('.answers');
    let questions = document.querySelector('.questions .content');

    let gameContainer = document.querySelector('.game')

    let popupOverLay = document.querySelector('.success-popup')
    let popupBox = document.querySelector('.success-popup .popup-box')
    let popupBoxUserScore = document.querySelector('.success-popup .popup-box .score-result .text .user-score')
    let popupBoxTotalQuestions = document.querySelector('.success-popup .popup-box .score-result .text .total-questions')
    let closePopupBtn = document.querySelector('.success-popup .popup-box .close')

    // forward and back buttons
    let back = document.querySelector('.back')
    let forward = document.querySelector('.forward')


    closePopupBtn.addEventListener('click' , ()=>{
      popupOverLay.classList.remove('show')
      popupBox.classList.remove('show')
    })

    startGameBtn.addEventListener('click' , () =>{

        forward.classList.add('show')
        back.classList.add('show')
        homeSection.classList.add('hidden')
        scoreBox.classList.add('show')
        topicTitle.classList.add('show')
        gameContainer.classList.add('show')
        document.body.style.cssText = 'background-color:#CF548080 !important'

        // get first topic
        fetch('./data.json').then((Result)=>{
            let data = Result.json();
            return data
        }).then((full)=>{
            let firstTopic = full[0]
            questionCount.textContent = firstTopic.questions.length;
            topicTitle.textContent = firstTopic.topic_title;

            // add all answers to html
            firstTopic.answers.forEach(answer => {
                let div = document.createElement('div')
                div.classList.add('answer')
                div.setAttribute('draggable', true)
                div.setAttribute('id' , answer.id)
                div.setAttribute('data-id' , answer.question_id)
                div.textContent = answer.title ;

                div.addEventListener('dragstart' , (e)=>{
                    e.dataTransfer.setData("text", e.target.id);
                })

                answers.appendChild(div)
            });

            // add questions
            let p = document.createElement('p')
            firstTopic.questions.forEach(question => {
              let span = document.createElement('span')
              let splitTitle = question.title.split('@A')

              span.setAttribute('id' , `separate-${question.id}`)
              span.classList.add('separate')
              span.textContent = 'answer'

                p.innerHTML += splitTitle[0]
                p.appendChild(span)
                p.innerHTML += splitTitle[1]

                questions.appendChild(p)
            });

            let allSpans = document.querySelectorAll('.questions .content p span')
            allSpans.forEach((ele)=>{
              ele.addEventListener('dragover' , (e)=>{
                e.preventDefault()
              })

              ele.addEventListener('drop' , (e)=>{
                e.preventDefault();
                let answerElement = document.getElementById(e.dataTransfer.getData("text"));
                let questionId = answerElement.getAttribute('data-id') ;
                let getElementText = answerElement.textContent

                if(+questionId === +e.target.id.split('-')[1]){
                  answerElement.remove()
                  e.target.textContent = getElementText ;
                  e.target.classList.add('underline')
                  e.target.classList.add('right')
                  
                  // update score and progress bar
                  score.innerText = +score.innerText + 1
                  let progressLength = +score.innerText / firstTopic.questions.length * 100 ;
                  progress.style.cssText = `width: ${progressLength}%`

                  if(+progressLength === 100){
                    popupBoxTotalQuestions.textContent = firstTopic.questions.length
                    popupBoxUserScore.textContent = firstTopic.questions.length

                    popupOverLay.classList.add('show')
                    setTimeout(()=>{
                      popupBox.classList.add('show')
                    } , 500)
                  }

                }else{
                  answerElement.classList.add('wrong')
                  setTimeout(()=>{
                    answerElement.classList.remove('wrong')
                  } , 1000)
                }
              })
            })
        })
    })



    function toggleFullScreen() {
      if (!document.fullscreenElement) {
        // Enter full-screen mode
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
          document.documentElement.msRequestFullscreen();
        }
      }
      // else{
      //       // Exit full-screen mode
      //   if (document.exitFullscreen) {
      //     document.exitFullscreen();
      //   } else if (document.mozCancelFullScreen) { /* Firefox */
      //     document.mozCancelFullScreen();
      //   } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
      //     document.webkitExitFullscreen();
      //   } else if (document.msExitFullscreen) { /* IE/Edge */
      //     document.msExitFullscreen();
      //   }
      // }
    }

    // open fullscreen view
    document.querySelector('.fullscreen').addEventListener('click' , ()=>{
      toggleFullScreen()
      document.querySelector('.fullscreen').style.cssText = `display:none`;
    })


    // check if user in portrait view or landscape
    let portrait = window.matchMedia("(orientation: portrait)");

    if(window.matchMedia("(orientation: portrait)").matches) {
      // portrait
        document.querySelector('.detact-landscape').classList.add('show')
    } else {
      // landscape
      document.querySelector('.detact-landscape').classList.remove('show')
    }

    portrait.addEventListener("change", function(e) {
        if(e.matches) {
          // portrait
          document.querySelector('.detact-landscape').classList.add('show')
          document.querySelector('.fullscreen').classList.remove("show")
        } else {
          // landscape
          // toggleFullScreen()
          document.querySelector('.detact-landscape').classList.remove('show')
          document.querySelector('.fullscreen').classList.add("show")
        }
    })
})




