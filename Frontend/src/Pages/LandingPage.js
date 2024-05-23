import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import imageone from '../Images/imageone.jpg';
import karate from '../Images/karate.jpg';
import Carousel from 'react-bootstrap/Carousel';
import kick from '../Images/kick.jpg';
import './Landing.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Carousel>
      <Carousel.Item interval={1000}>
        <img
          className="d-block w-100"
          src={imageone}  // Use the imported image
          alt="First slide"
          style={{ objectFit: 'cover', height: '93vh' }}
        />
        <Carousel.Caption  style={{ top: '50%', transform: 'translateY(-50%)' }}>
          <h3>Unleash the Thrill with Clash: Your Gateway to Effortless Tournament Management</h3>
          <p>Welcome to Clash, your ultimate platform for seamlessly organizing and managing tournaments tailored to your preferred sport! Whether you're an avid sports enthusiast, a passionate gamer, or a company looking to foster team spirit, Clash is here to revolutionize the way you experience competitions.</p>
          <Button type="button" variant="primary" size="lg" active onClick={() => navigate('/AccountUser')} style={{fontSize: '14px'}}>
  BEGIN CREATING TOURNAMENTS!
</Button>
<Button type="button" variant="primary" size="lg" active onClick={() => navigate('/CompetitorView')} style={{fontSize: '14px'}}>
  SIGN UP FOR A TOURNAMENT!
</Button>

        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={500}>
        {/* Replace ExampleCarouselImage with your own content */}
        <img
          className="d-block w-100"
          src={karate}  // Replace with the path to your second image
          alt="Second slide"
          style={{ objectFit: 'cover', height: '93vh' }} 
        />
        <Carousel.Caption style={{ top: '50%', transform: 'translateY(-50%)' }}>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <Button type="button" variant="primary" size="lg" active onClick={() => navigate('/AccountUser')} style={{fontSize: '14px'}}>
  BEGIN CREATING TOURNAMENTS!
</Button>
<Button type="button" variant="primary" size="lg" active onClick={() => navigate('/CompetitorView')} style={{fontSize: '14px'}}>
  SIGN UP FOR A TOURNAMENT!
</Button>

        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        {/* Replace ExampleCarouselImage with your own content */}
        <img
          className="d-block w-100"
          src={kick}  // Replace with the path to your third image
          alt="Third slide"
          style={{ objectFit: 'cover', height: '93vh' }} 
        />
        <Carousel.Caption style={{ top: '50%', transform: 'translateY(-50%)' }} >
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          <Button type="button" variant="primary" size="lg" active onClick={() => navigate('/AccountUser')} style={{fontSize: '14px'}}>
  BEGIN CREATING TOURNAMENTS!
</Button>
<Button type="button" variant="primary" size="lg" active onClick={() => navigate('/CompetitorView')} style={{fontSize: '14px'}}>
  SIGN UP FOR A TOURNAMENT!
</Button>

        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default LandingPage;


        
{/*<img src={imageone} style={{ height: '0%', width:'100%' }} alt="..."/>

<h2> Unleash the Thrill with Clash: Your Gateway to Effortless Tournament Management </h2>
        <h4>Welcome to Clash, your ultimate platform for seamlessly organizing and managing tournaments tailored to your preferred sport! Whether you're an avid sports enthusiast, a passionate gamer, or a company looking to foster team spirit, Clash is here to revolutionize the way you experience competitions.

At Clash, we empower individuals and organizations to effortlessly create, customize, and oversee tournaments for any sport imaginable. Our user-friendly interface allows you to set up tournaments with ease, giving you the flexibility to define rules, invite participants, and craft the perfect competitive environment.

With Clash, you can take control of your tournament from start to finish. Design comprehensive brackets, add competitors, and watch your event come to life. Experience the excitement in real-time as matches unfold, with live updates on scores, winners, and the next matchups. Our intuitive system ensures that you stay connected to the action, providing a dynamic and engaging experience for both organizers and participants.

Say goodbye to the hassle of manual tournament management. Embrace the future of sports and competition with Clash – where creating and enjoying tournaments is as seamless as the victories that unfold within them. Join us in bringing your favorite sports and games to the next level!
</h4>

<Button type="button" variant="primary" size="lg" active  onClick={() => navigate('/AccountUsers')}>Sign UP! </Button>

*/}