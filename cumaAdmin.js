function authorize(roles) {
  return (req, res, next) => {
      console.log("User in authorize middleware:", req.user);
      if (!req.user || !req.user.role) {
          console.log("No user or role found in request");
          return res.redirect('/login');
      }
      const userRole = req.user.role;
      if (!roles.includes(userRole)) {
          console.log(`User role ${userRole} not authorized for this route`);
          return res.status(403).json({ error: 'Access denied' });
      }
      next();
  };
}

export default authorize;