import React from "react";
import { Dumbbell } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-12 mb-8 md:mb-12">
          {/* Logo and Description */}
          <div className="space-y-4 md:space-y-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <div className="bg-red-500 rounded-xl p-2 md:p-3 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold">FITPRO</h3>
                  <p className="text-sm md:text-base text-gray-400">
                    GYM & STORE
                  </p>
                </div>
              </div>
            </Link>
            <p className="text-gray-400 text-base md:text-lg max-w-xs md:max-w-md">
              Transformá tu cuerpo y tu vida. Entrenamiento de clase mundial,
              productos premium y una comunidad que te impulsa.
            </p>
          </div>

          {/* Enlaces y Contacto - Grid en móvil */}
          <div className="grid grid-cols-2 gap-8 md:contents">
            {/* Enlaces */}
            <div>
              <h4 className="text-lg md:text-xl font-bold md:font-normal mb-4 md:mb-6">
                Enlaces
              </h4>
              <ul className="space-y-3 md:space-y-4">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors text-base md:text-lg"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/planes"
                    className="text-gray-400 hover:text-white transition-colors text-base md:text-lg"
                  >
                    Planes
                  </Link>
                </li>
                <li>
                  <Link
                    href="#tienda"
                    className="text-gray-400 hover:text-white transition-colors text-base md:text-lg"
                  >
                    Tienda
                  </Link>
                </li>
                <li>
                  <Link
                    href="#carrito"
                    className="text-gray-400 hover:text-white transition-colors text-base md:text-lg"
                  >
                    Carrito
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-lg md:text-xl font-bold md:font-normal mb-4 md:mb-6">
                Contacto
              </h4>
              <ul className="space-y-3 md:space-y-4 text-gray-400 text-base md:text-lg">
                <li>info@fitprogym.com</li>
                <li>+54 11 1234-5678</li>
                <li>Lun - Vie: 6am - 10pm</li>
                <li>Sáb - Dom: 8am - 8pm</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400 text-sm md:text-base">
            © {new Date().getFullYear()} FitPro Gym. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
