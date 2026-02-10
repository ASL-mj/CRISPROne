import "./index.scss";

function News() {
  return (
    <div className="news">
      <h1>News</h1>
      <div className="divider"></div>
      <ul className="timeline">
        <li className="timeline-item">
          <h5>Put forward the idea</h5>
          <p className="date">March 1, 2022</p>
          <p className="description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
            necessitatibus adipisci, ad alias, voluptate pariatur officia
            repellendus repellat inventore fugit perferendis totam dolor
            voluptas et corrupti distinctio maxime corporis optio?
          </p>
        </li>

        <li className="timeline-item">
          <h5>Construction of website framework</h5>
          <p className="date">March 19, 2022</p>
          <p className="description">
            Quisque ornare dui nibh, sagittis egestas nisi luctus nec. Sed
            aliquet laoreet sapien, eget pulvinar lectus maximus vel. Phasellus
            suscipit porta mattis.
          </p>
        </li>

        <li className="timeline-item">
          <h5>
            Complete sgRNA design and off target evaluation of CRISPR/Cas9
          </h5>
          <p className="date">June 24, 2022</p>
        </li>

        <li className="timeline-item">
          <h5>
            Complete the sgRNA design of other gene editing systems and fill in
            the whole content of the website
          </h5>
          <p className="date">October 15, 2022</p>
        </li>
      </ul>
    </div>
  );
}

export default News;
