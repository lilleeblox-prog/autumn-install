import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="container-wide page-header-wrapper">
      <div className="page-header">
        <span className="eyebrow">404 / Page not found</span>
        <h1>This page isn't here.</h1>
        <p>The page you were looking for may have moved. You can return to the builder to create your display.</p>
        <Link href="/" className="text-link">Return to the builder</Link>
      </div>
    </div>
  );
}