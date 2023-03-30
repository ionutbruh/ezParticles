function Vector2(x, y) {
  this.x = x;
  this.y = y;
}

function getRandomIntN(max) {
  if (Math.random(1.5) > .75)  {
      return Math.floor(Math.random() * max);
  }else{
      return -Math.floor(Math.random() * max);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

console.log(getRandomInt(100))

function lerp(a, b, alpha) {
  return a + alpha * (b - a);
}

function unit(a) {
  if (a < 0) { return -1 } else { return 1 }
}

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

function getObjectFitSize(
  contains /* true = contain, false = cover */,
  containerWidth,
  containerHeight,
  width,
  height
) {
  var doRatio = width / height;
  var cRatio = containerWidth / containerHeight;
  var targetWidth = 0;
  var targetHeight = 0;
  var test = contains ? doRatio > cRatio : doRatio < cRatio;

  if (test) {
    targetWidth = containerWidth;
    targetHeight = targetWidth / doRatio;
  } else {
    targetHeight = containerHeight;
    targetWidth = targetHeight * doRatio;
  }

  return {
    width: targetWidth,
    height: targetHeight,
    x: (containerWidth - targetWidth) / 2,
    y: (containerHeight - targetHeight) / 2
  };
}


async function particles(tagId, properties) {
  await document.onload
  let canvas = document.getElementById(tagId)
  let context = canvas.getContext('2d');

  const dimensions = getObjectFitSize(
    true,
    canvas.clientWidth,
    canvas.clientHeight,
    canvas.width,
    canvas.height
  );

  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  let particles = [];
  for (let index = 0; index < properties.amount; index++) {
    let pos = new Vector2(getRandomInt(dimensions.width), getRandomInt(dimensions.height))
    let particle_obj = {
      size: 1 + Math.abs(getRandomInt(3)),
      origin : pos,
      position: pos,
      target: null
    }
    particles.push(particle_obj)
  }

  let update_positions = setInterval(function() {
    for (let index = 0; index < particles.length; index++) {
      particles[index].target = new Vector2(
        
        clamp(particles[index].origin.x + getRandomIntN(properties.jiggle),particles[index].origin.x-properties.jiggle , particles[index].origin.x+properties.jiggle),
       clamp(particles[index].origin.y + getRandomIntN(properties.jiggle),particles[index].origin.y-properties.jiggle , particles[index].origin.y+properties.jiggle)
      )
       
    }
  }, 2000)

  let update = setInterval(function() {
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < particles.length; index++) {
      if(!particles[index].target) continue
      
      context.scale(1, 1);
      context.beginPath();

      let newPosition = new Vector2(
        lerp(particles[index].position.x, particles[index].target.x, 0.001),
        lerp(particles[index].position.y, particles[index].target.y, 0.001)
      )
      particles[index].position = newPosition;

      context.arc(
        newPosition.x,
        newPosition.y,
        particles[index].size,
        0, 2 * Math.PI);

      particles[index].position = newPosition;

      context.fillStyle = "blue";
      context.fill();

      if (particles[index + 1] && particles[index].size > 2.5) {
        
        context.beginPath();
        context.moveTo(newPosition.x, newPosition.y);
        context.lineTo(particles[index + 1].position.x, particles[index + 1].position.y);
        context.strokeStyle = "blue";
        context.lineWidth = .2;
        context.stroke();
      }

    }
  }, 10)

}

particles("main", { amount: 1000, speed: 20 , jiggle:200 });