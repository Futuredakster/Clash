import './Landing.css';
import { Button } from 'react-bootstrap';

function LandingPage (){
    return(
        <div>
            <header className="mb-3">
             <h2> Unleash the Thrill with Clash: Your Gateway to Effortless Tournament Management </h2>
            </header>
                <div className="Main-Text">
                    <h4>Welcome to Clash, your ultimate platform for seamlessly organizing and managing tournaments tailored to your preferred sport! Whether you're an avid sports enthusiast, a passionate gamer, or a company looking to foster team spirit, Clash is here to revolutionize the way you experience competitions.

At Clash, we empower individuals and organizations to effortlessly create, customize, and oversee tournaments for any sport imaginable. Our user-friendly interface allows you to set up tournaments with ease, giving you the flexibility to define rules, invite participants, and craft the perfect competitive environment.

With Clash, you can take control of your tournament from start to finish. Design comprehensive brackets, add competitors, and watch your event come to life. Experience the excitement in real-time as matches unfold, with live updates on scores, winners, and the next matchups. Our intuitive system ensures that you stay connected to the action, providing a dynamic and engaging experience for both organizers and participants.

Say goodbye to the hassle of manual tournament management. Embrace the future of sports and competition with Clash – where creating and enjoying tournaments is as seamless as the victories that unfold within them. Join us in bringing your favorite sports and games to the next level!
</h4>
                </div>
                <Button type="button" variant="primary" size="lg" active>Sign UP! </Button>
                
        </div>
    )
}
export default LandingPage;