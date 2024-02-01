
import { Link } from "react-router-dom";
import '../css/landing.css'
import bg from '../images/gamcologo.png'
import desktop from '../images/bg-desk-new1.png'
import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css'; 
import cat1 from '../images/expense-new-icon.png'
import cat2 from '../images/income-icon-removebg-preview.png'
import cat3 from '../images/budget-new-icon.png'
import cat4 from '../images/savings-cons-removebg-preview.png'
import cat5 from '../images/investment-icon-removebg-preview.png'
import serv1 from '../images/icon_award.svg'
import serv2 from '../images/icon_localized.svg'
import serv4 from '../images/icon_support.svg'

const LandingPage = () => {
   


    useEffect(() => {
      AOS.init({
        duration: 2000, // Set the animation duration in milliseconds
        once: true, // Set to true if you want the animation to occur only once
      });
    }, []);


    useEffect(() => {
      // Initialize Swiper
      const swiper = new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 10,
        loop: true,
        breakpoints: {
          // when window width is <= 767px (mobile)
          0: {
            slidesPerView: 1,
          },
          // when window width is <= 991px (tablet)
          991: {
            slidesPerView: 2,
          },
          // when window width is <= 1199px (small desktop)
          1199: {
            slidesPerView: 4,
          },
        },
        // Add other Swiper options as needed
      });
    
      // Destroy Swiper on component unmount
      return () => {
        swiper.destroy();
      };
    }, []);
    
  return (
    <div>
     <nav className="navbar navbar-expand-lg  fixed-top" style={{background: 'linear-gradient(to left, #0A909F, #043747)'}}>
  <div className="container-fluid">
  <img src={bg} alt="" style={{width: '110px' }} />
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
  <span className="navbar-toggler-icon"></span>
</button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav me-auto mb-2 mb-lg-0 mx-auto text-center"> {/* Add mx-auto and text-center classes */}
    <li className="nav-item">
      <a className="nav-link" style={{fontSize: '18px' , color: '#ffff'}} aria-current="page" href="#home">
        Home
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link" style={{fontSize: '18px' , color: '#ffff'}} href="#about">
        About
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link" style={{fontSize: '18px' , color: '#ffff'}} href="#services">
        Services
      </a>
    </li>
  </ul>
  <form className="d-flex justify-content-center justify-content-lg-end" role="search">
    {/* Use justify-content-center for mobile and justify-content-lg-end for larger screens */}
    <Link to="/register">
    <button className="btn btn-register" style={{ color: '#ffff' }} type="submit">
      REGISTER
    </button>
    </Link>
  </form>
</div>
</div>
</nav>


<section className="hero" id="home">
      <div className="container" data-aos="fade-right">
        <div className="context">
          <h1>Personal Money Management System</h1>
          <p>Let's try our features; it includes tracking of expenses, income, savings, budget, and investment.</p>
          <button className="btn btn-register" style={{ color: '#ffff' }} type="submit">
            REGISTER
          </button>
        </div>

        <div className="image" data-aos="fade-up" data-aos-anchor-placement="top-center">
          <img src={desktop} alt="" />
        </div>
      </div>
    </section>


    <section className="category" id="about">
      <h1>FEATURES</h1>
      <div className="swiper-container">
        <div className="swiper-wrapper">
          <div className="swiper-slide col1">
            <img src={cat1} alt="" />
            <h2>Track Expenses</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate voluptates corporis dolores nihil optio, libero culpa praesentium enim, deleniti aspernatur pariatur vel. Saepe magnam eius ratione eos nulla modi dolorum!</p>
          </div>
          <div className="swiper-slide col1">
            <img src={cat2} alt="" />
            <h2>Track Income</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum optio a aspernatur fuga repellendus laudantium, corporis aliquam quod, totam unde, iusto ad reprehenderit molestias dolore recusandae repudiandae in molestiaes</p>
          </div>
          <div className="swiper-slide col1">
            <img src={cat3} alt="" />
            <h2>Track Budget</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore dicta quas voluptatum consequatur quam provident veritatis aliquam facilis excepturi ea? Tempore dolorem mollitia enim quos! Facere at suscipit libero eius!</p>
          </div>
          <div className="swiper-slide col1">
            <img src={cat4} alt="" />
            <h2>Track Savings</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium rem animi quisquam tenetur eius veniam illo, temporibus harum maxime, nisi necessitatibus laudantium voluptatem, molestias facere quibusdam.</p>
          </div>
          <div className="swiper-slide col1">
            <img src={cat5} alt="" />
            <h2>Track Investment</h2>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Exercitationem, provident vel ducimus inventore illo laudantium, odio nobis, ipsa deserunt quos beatae nesciunt deleniti vitae architecto consectetur! Animi sequi magnam</p>
          </div>
          {/* Add more slides as needed */}
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </section>


    <section className="services" id="services">
      <h1>Why To Choose Us! </h1>
      <div className="col2" data-aos="fade-left">
        <img src={serv1} alt="" />
        <h1>Award-winning platform</h1>
        <p>Award-winning software recognized and praised by the most respected experts.</p>
      </div>
      <div className="col2" data-aos="fade-up">
        <img src={serv2} alt="" />
        <h1>Customizable interface</h1>
        <p>Customize the platform to make it fit better to your needs — from chart type to color theme.</p>
      </div>

     
  
      <div className="col2" data-aos="fade-right" id="services">
        <img src={serv4} alt="" />
        <h1>Support 24/7 assitance</h1>
        <p>A team of professionals speaking your mother tongue are always here to support you.</p>
      </div>
    
    </section>


    <section className="steps">
      <h1>It's simple to get started our application! </h1>
      <div className="col2" data-aos="fade-down">
        <h2>Step 1</h2>
        <h1>Sign up / Sign in</h1>
        <p>Create an account for free using your email address and it will secure the password!</p>
      </div>
      <div className="col2" data-aos="fade-up-right">
        <h2>Step 2</h2>
        <h1>Try our application</h1>
        <p>See what it’s like to track your finance without putting your money at risk.</p>
      </div>
  
      <div className="col2" data-aos="fade-down-right">
        <h2>Step 3</h2>
        <h1> Track your finance</h1>
        <p>Put your finance so that you can track your expenses, Income , Savings and etc.</p>
      </div>
    
    </section>



<footer>
  <h1>Developed by: GAMCO </h1>
</footer>
    </div>
  )
}

export default LandingPage
