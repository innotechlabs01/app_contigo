import 'package:flutter/material.dart';

class TestimonialsSection extends StatelessWidget {
  const TestimonialsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Testimonios',
              style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFFF3F3F3),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.format_quote,
                    size: 40,
                    color: const Color(0xFF00668A).withValues(alpha: 0.3)),
                const SizedBox(height: 12),
                Text(
                  '"Gracias a Contigo encontré a María, quien me acompaña a mis terapias. Ahora espero con ansias sus visitas."',
                  style: Theme.of(context)
                      .textTheme
                      .bodyLarge
                      ?.copyWith(fontStyle: FontStyle.italic),
                ),
                const SizedBox(height: 16),
                Text('— Ana M., 72 años',
                    style: Theme.of(context).textTheme.labelLarge),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
