import { Link } from "react-router-dom";

const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>
          Bienvenido a <span className="nowrap">TechNotePro</span>
        </h1>
        <h3>Optimiza la gestión técnica de tu empresa</h3>
      </header>
      <main className="public__main">
        <p>
            TechNotePro es una plataforma web desarrollada por Nestor Campuzano para mejorar la organización y el
            seguimiento de reportes técnicos en empresas de servicio, mantenimiento y soporte electrónico.
          </p>
          <p>
            Este sistema permite a técnicos y administradores registrar, consultar y actualizar órdenes de servicio de forma ágil, organizada y segura, desde cualquier dispositivo con acceso a internet.
          </p>
          <p><strong>Ideal para:</strong> talleres, empresas de soporte técnico, servicios posventa, mantenimientos industriales, PYMES tecnológicas y más.</p>
          <p>¿Listo para optimizar tu empresa? Accede al sistema y comienza ahora.</p>
        <address className="public__addr">
          NC. TECNOLOGIAS
          <br />
          Calle 72Hbis 28e - 60
          <br />
          Cali Valle
          <br />
          <a href="tel:+573143934875" className="text-info">(314) 393-4875</a>
        </address>
        <br />
        <p>Propietario: Nesor Campuzano</p>
      </main>
      <footer>
        <Link to="/login" className="btn btn-primary">Login Empleados</Link>
      </footer>
    </section>
  );
  return content;
};

export default Public;
