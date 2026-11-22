import 'package:equatable/equatable.dart';

/// Model post dari API publik JSONPlaceholder.
class Post extends Equatable {
  const Post({
    required this.id,
    required this.judul,
    required this.isi,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] as int,
      judul: json['title'] as String,
      isi: json['body'] as String,
    );
  }

  final int id;
  final String judul;
  final String isi;

  Map<String, dynamic> toJson() => {
        'title': judul,
        'body': isi,
        'userId': 1,
      };

  @override
  List<Object?> get props => [id, judul, isi];
}
