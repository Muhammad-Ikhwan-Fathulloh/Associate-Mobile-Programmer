import 'package:flutter/material.dart';

import 'router/app_router.dart';

class AssociateMobileApp extends StatelessWidget {
  const AssociateMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Associate Mobile Programmer',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      darkTheme: ThemeData(
        colorSchemeSeed: Colors.indigo,
        useMaterial3: true,
        brightness: Brightness.dark,
      ),
      routerConfig: appRouter,
    );
  }
}
