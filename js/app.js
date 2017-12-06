var Pad = Pad || {};

Pad.Carousel = {
  setup: function() {
    const $calc = $('.calc');
    if (!$calc.length) return false;

    this.version = $calc.data('version');
    this.init();
  },
  init: function() {
    this.$carousel = $('.calc__carousel');
    this.$resultMonthly = $('.slide__result__saving--month');
    this.$resultYearly = $('.slide__result__saving--year');
    this.$reset = $('.calc__reset');
    this.$buttons = $('.calc__end');

    this.appendSlides(this.version);
    this.initCarousel();
  },
  userFocused: false,
  resetCarousel: function() {
    this.$carousel.slick('slickGoTo', 0);
    this.toggleButtons();
  },
  toggleButtons: function() {
    this.$next.toggle();
    this.$buttons.toggleClass('visible');
  },
  appendSlides: function() {
    const questions = this.questions[this.version];

    questions.reverse().forEach(function (question){
      let logos = '';
      if(question.logos) {
        let images = '';
        question.logos.forEach(function(logo) {
          images = images += `<img src="${logo}" alt="${logo}">`;
        });

        logos = `<div class="slide__logos">${images}</div>`;
      }

      const html = `
        <div>
          <div class="calc__carousel__slide">
            <h2 class="slide__heading">${question.text}</h2>
            <div class="slide__input">
              <label for="${question.id}">£</label>
              <input type="number" id="${question.id}" placeholder="0" min="0">
            </div>
            ${logos}
          </div>
        </div>
      `;
      const $slide = $(html);
      this.$carousel.prepend($slide);
    }.bind(this));
  },
  initCarousel: function() {
    this.$carousel.slick(this.options);
    this.$slides = $('.slick-slide');
    this.$inputs = $('.slide__input input');
    this.$next = $('.calc__carousel__next');

    this.addEventListeners();
  },
  addEventListeners: function() {
    this.$reset.on('click', this.resetCarousel.bind(this));

    this.$carousel.on('beforeChange', function(slick, currentSlide, index){
      if(index === this.$slides.length - 2) this.calculate();
    }.bind(this));

    this.$carousel.on('afterChange', function(slick, currentSlide, index){
      this.$slides.eq(index).find('.slide__input input').focus();
    }.bind(this));

    // not working on webflow and can't work out why
    this.$inputs.on('focus', function() {
      this.userFocused = true;
    }.bind(this)).on('blur', function() {
      this.userFocused = false;
    }.bind(this));

    $(window).on('keypress', function(e) { // go to next slide if user presses enter whilst focused on an input
      if(e.keyCode === 13 && this.userFocused) this.$carousel.slick('slickNext');
    }.bind(this));
  },
  calculate: function() {
    let totalSavings = 0;

    const $properties = $('#properties');
    const noOfProperties = ($properties.length && !!$properties.val()) ? $properties.val() : 1;

    const $despoit = $('#deposit');
    if ($despoit.length) {
      const depositPaid = $('#deposit').val();
      const despositLost = (depositPaid * 0.4) / 12;
      totalSavings = totalSavings += despositLost;
    }

    const questions = this.questions[this.version];
    const additional = this.additional[this.version];

    questions.forEach(function(question) {
      const amountSpent = $('#' + question.id).val();
      if (!amountSpent) return false;
      const amountSaved = amountSpent * question.saving;
      totalSavings = totalSavings += amountSaved;
    });

    additional.forEach(function(additional) {
      totalSavings = totalSavings += additional.amount;
    });

    let totalMonthlySavings = 0;
    let totalYearlySavings = 0;

    if(this.version === 'landlord') {
      totalYearlySavings = totalSavings * noOfProperties;
      totalMonthlySavings = totalYearlySavings / 12;
    } else {
      totalMonthlySavings = totalSavings * noOfProperties;
      totalYearlySavings = totalMonthlySavings * 12;
    }

    this.$resultMonthly.text('£' + totalMonthlySavings.toFixed(2));
    this.$resultYearly.text('£' + totalYearlySavings.toFixed(2));
    this.toggleButtons();
  },
  options: {
    infinite: false,
    swipe: false,
    touchMove: false,
    nextArrow: '<button class="calc__carousel__next">Next</button>',
    prevArrow: ''
  },
  questions: {
    tenant: [
      {
        text: 'How much do you spend on <strong>clothing</strong> per month?',
        saving: 0.08,
        id: 'clothing',
        logos: ['https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce6eae0b670001168992_topshop.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce61564b3a000140b6a2_gap.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce647a305e0001536d81_new-look.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce6a7a305e0001536d88_river-island.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce66ae0b67000116898e_house-of-fraser.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce669ef8d4000165bfdf_john-lewis.jpg']
      },
      {
        text: 'How much do you spend on <strong>eating out</strong> per month?',
        saving: 0.12,
        id: 'eating',
        logos: ['https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce69da590200018f7005_pizza-express.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce6b564b3a000140b6aa_tgi-fridays.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce64ae0b67000116898c_ask-italian.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce6eae0b670001168993_yo-sushi.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce70cd88f80001c06c82_zizzi.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce69ae0b67000116898f_papa-johns.jpg'] // cafe-rouge
      },
      {
        text: 'How much do you spend on <strong>health & beauty</strong> per month?',
        saving: 0.08,
        id: 'health',
        logos: ['https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce65564b3a000140b6a4_boots.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce6cda590200018f7008_body-shop.jpg']
      },
      {
        text: 'How much do you spend on <strong>groceries</strong> per month?',
        saving: 0.05,
        id: 'groceries',
        logos: ['https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce6d9ef8d4000165bfe2_waitrose.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce687a305e0001536d86_marks-and-spencer.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce68564b3a000140b6a8_sainsburys.jpg']
      },
      {
        text: 'How much do you spend on <strong>coffee</strong> per month?',
        saving: 0.10,
        id: 'coffee',
        logos: ['https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce667a305e0001536d84_cafe-nero.jpg']
      },
      {
        text: 'How much do you spend on <strong>bills</strong> per month?',
        saving: 0.10,
        id: 'bills',
        logos: ['https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce617a305e0001536d7d_edf-energy.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce61cd88f80001c06c7b_thames-water.jpg', 'https://daks2k3a4ib2z.cloudfront.net/59df4f1b14d0c5000130e3e2/5a27ce61ae0b670001168987_octopus.jpg']
      }
    ],
    landlord: [
      {
        text: 'How much do you spend on <strong>finding a tenant</strong> for a property?',
        saving: 1,
        id: 'finding'
      },
      {
        text: 'How much do you spend on <strong>tenant and property management</strong> per property each year?',
        saving: 1,
        id: 'management'
      },
      {
        text: 'How much do you spend on <strong>maintenance</strong> per property each year?',
        saving: 1,
        id: 'maintenance'
      },
      {
        text: 'How much do you spend on <strong>wifi</strong> per property each year?',
        saving: 1,
        id: 'wifi'
      },
      {
        text: 'How much do you spend on <strong>cleaning</strong> per property each year?',
        saving: 1,
        id: 'cleaning'
      },
      {
        text: 'How much do you spend on <strong>building insurance</strong> per property each year?',
        saving: 0.5,
        id: 'building-insurance'
      },
      {
        text: 'How much do you spend on <strong>landlord insurance</strong> per property each year?',
        saving: 1,
        id: 'landlord-insurance'
      },
      {
        text: 'How much do you spend on <strong>certificates</strong> per property each year?',
        saving: 0.5,
        id: 'certificates'
      },
      {
        text: 'How much do you spend on <strong>legal</strong> per property each year?',
        saving: 1,
        id: 'legal'
      }
    ]
  },
  additional: {
    tenant: [
      {
        name: 'Netflix',
        amount: 7.99
      },
      {
        name: 'Cleaning',
        amount: 20
      },
      {
        name: 'Wifi',
        amount: 12
      }
    ],
    landlord: [
      {
        name: 'PadCare',
        amount: -59 * 12
      }
    ]
  }
};

$(Pad.Carousel.setup.bind(Pad.Carousel));
