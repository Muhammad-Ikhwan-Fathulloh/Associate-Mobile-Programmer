import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../blocs/post_cubit.dart';
import '../pages/home_page.dart';
import '../pages/location_page.dart';
import '../pages/note_form_page.dart';
import '../pages/notes_page.dart';
import '../pages/post_detail_page.dart';
import '../pages/post_form_page.dart';
import '../pages/posts_page.dart';
import '../services/post_service.dart';

final GoRouter appRouter = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
    ),
    // Hari 1
    GoRoute(
      path: '/catatan',
      builder: (context, state) => const NotesPage(),
    ),
    GoRoute(
      path: '/catatan/baru',
      builder: (context, state) => const NoteFormPage(),
    ),
    GoRoute(
      path: '/lokasi',
      builder: (context, state) => const LocationPage(),
    ),
    // Hari 2
    GoRoute(
      path: '/post',
      builder: (context, state) => BlocProvider(
        create: (_) => PostCubit(PostService())..load(),
        child: const PostsPage(),
      ),
    ),
    // Rute '/post/baru' harus didaftarkan sebelum '/post/:id'
    GoRoute(
      path: '/post/baru',
      builder: (context, state) => const PostFormPage(),
    ),
    GoRoute(
      path: '/post/:id',
      builder: (context, state) {
        final id = int.tryParse(state.pathParameters['id'] ?? '');
        if (id == null) {
          return const Scaffold(
            body: Center(child: Text('ID post tidak valid')),
          );
        }
        return PostDetailPage(postId: id);
      },
    ),
  ],
);
